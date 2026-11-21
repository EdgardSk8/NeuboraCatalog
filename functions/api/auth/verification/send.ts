import { getAuthenticatedSession } from '../../../_lib/auth'
import { sendVerificationEmail } from '../../../_lib/email'
import { isSameOrigin, json, readJsonObject } from '../../../_lib/http'
import { CODE_TTL_MINUTES, RESEND_COOLDOWN_SECONDS, issueVerificationCode } from '../../../_lib/verification'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return json({ error: 'Solicitud de origen no permitido.' }, 403)

  const session = await getAuthenticatedSession(request, env.DB)
  if (!session) return json({ error: 'Inicia sesión para continuar.' }, 401)
  if (session.emailVerified) return json({ error: 'Este correo ya está confirmado.' }, 409)

  const body = await readJsonObject(request)
  const language = body?.language === 'en' ? 'en' : 'es'

  const result = await issueVerificationCode(env.DB, session.userId, Date.now())
  if (!result.ok) {
    return json({
      error: `Espera ${result.retryAfter} segundos antes de pedir otro código.`,
      retryAfter: result.retryAfter,
    }, 429, { 'Retry-After': String(result.retryAfter) })
  }

  const delivered = await sendVerificationEmail(env, session.email, result.code, language, new URL(request.url).origin)

  if (!delivered) {
    return json({
      error: 'No se pudo enviar el correo de confirmación. Inténtalo de nuevo en un minuto.',
      retryAfter: RESEND_COOLDOWN_SECONDS,
    }, 503, { 'Retry-After': String(RESEND_COOLDOWN_SECONDS) })
  }

  return json({
    ok: true,
    expiresInMinutes: CODE_TTL_MINUTES,
    retryAfter: RESEND_COOLDOWN_SECONDS,
  })
}
