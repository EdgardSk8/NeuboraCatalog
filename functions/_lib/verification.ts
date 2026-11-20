import { sha256 } from './http'

export const CODE_TTL_MINUTES = 10
export const RESEND_COOLDOWN_SECONDS = 60
export const MAX_ATTEMPTS = 5
export const MAX_SENDS_PER_HOUR = 5

const HOUR_MS = 60 * 60 * 1000
const CODE_RANGE = 1_000_000

type VerificationRow = {
  code_hash: string
  expires_at: string
  created_at: string
  last_sent_at: string
  sends: number
  attempts: number
}

export type IssueResult =
  | { ok: true; code: string; expiresAt: string; retryAfter: number }
  | { ok: false; retryAfter: number }

export type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: 'missing' | 'expired' | 'locked' | 'mismatch'; remaining?: number }

export function generateVerificationCode(): string {
  // Rechaza la cola sobrante para que los 6 dígitos sean uniformes.
  const limit = Math.floor(0x1_0000_0000 / CODE_RANGE) * CODE_RANGE
  const buffer = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buffer)
    if (buffer[0] < limit) return String(buffer[0] % CODE_RANGE).padStart(6, '0')
  }
}

export async function hashVerificationCode(userId: string, code: string): Promise<string> {
  return sha256(`${userId}:${code}`)
}

function codesMatch(expectedHex: string, candidateHex: string): boolean {
  if (expectedHex.length !== candidateHex.length) return false
  let difference = 0
  for (let index = 0; index < expectedHex.length; index += 1) {
    difference |= expectedHex.charCodeAt(index) ^ candidateHex.charCodeAt(index)
  }
  return difference === 0
}

async function readVerification(db: D1Database, userId: string): Promise<VerificationRow | null> {
  return db.prepare(`
    SELECT code_hash, expires_at, created_at, last_sent_at, sends, attempts
    FROM email_verification_codes
    WHERE user_id = ?1
    LIMIT 1
  `).bind(userId).first<VerificationRow>()
}

async function clearVerification(db: D1Database, userId: string): Promise<void> {
  await db.prepare('DELETE FROM email_verification_codes WHERE user_id = ?1').bind(userId).run()
}

export async function issueVerificationCode(db: D1Database, userId: string, nowMs: number): Promise<IssueResult> {
  const existing = await readVerification(db, userId)
  const withinHour = existing ? nowMs - Date.parse(existing.created_at) < HOUR_MS : false

  if (existing) {
    const cooldownMs = RESEND_COOLDOWN_SECONDS * 1000 - (nowMs - Date.parse(existing.last_sent_at))
    if (cooldownMs > 0) return { ok: false, retryAfter: Math.ceil(cooldownMs / 1000) }
    if (withinHour && existing.sends >= MAX_SENDS_PER_HOUR) {
      const windowMs = Date.parse(existing.created_at) + HOUR_MS - nowMs
      return { ok: false, retryAfter: Math.max(1, Math.ceil(windowMs / 1000)) }
    }
  }

  const code = generateVerificationCode()
  const codeHash = await hashVerificationCode(userId, code)
  const expiresAt = new Date(nowMs + CODE_TTL_MINUTES * 60_000).toISOString()
  const sentAt = new Date(nowMs).toISOString()
  const windowStartedAt = withinHour && existing ? existing.created_at : sentAt
  const sends = withinHour && existing ? existing.sends + 1 : 1

  await db.prepare(`
    INSERT INTO email_verification_codes (user_id, code_hash, expires_at, created_at, last_sent_at, sends, attempts)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0)
    ON CONFLICT(user_id) DO UPDATE SET
      code_hash = excluded.code_hash,
      expires_at = excluded.expires_at,
      created_at = excluded.created_at,
      last_sent_at = excluded.last_sent_at,
      sends = excluded.sends,
      attempts = 0
  `).bind(userId, codeHash, expiresAt, windowStartedAt, sentAt, sends).run()

  return { ok: true, code, expiresAt, retryAfter: RESEND_COOLDOWN_SECONDS }
}

export async function confirmVerificationCode(db: D1Database, userId: string, code: string, nowMs: number): Promise<ConfirmResult> {
  const row = await readVerification(db, userId)
  if (!row) return { ok: false, reason: 'missing' }
  if (nowMs > Date.parse(row.expires_at)) {
    await clearVerification(db, userId)
    return { ok: false, reason: 'expired' }
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await clearVerification(db, userId)
    return { ok: false, reason: 'locked' }
  }

  const candidate = await hashVerificationCode(userId, code)
  if (!codesMatch(row.code_hash, candidate)) {
    const attempts = row.attempts + 1
    if (attempts >= MAX_ATTEMPTS) {
      await clearVerification(db, userId)
      return { ok: false, reason: 'locked' }
    }
    await db.prepare('UPDATE email_verification_codes SET attempts = ?2 WHERE user_id = ?1')
      .bind(userId, attempts).run()
    return { ok: false, reason: 'mismatch', remaining: MAX_ATTEMPTS - attempts }
  }

  await db.batch([
    db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?1').bind(userId),
    db.prepare('DELETE FROM email_verification_codes WHERE user_id = ?1').bind(userId),
  ])
  return { ok: true }
}
