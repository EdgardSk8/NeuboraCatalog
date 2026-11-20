import { getAuthenticatedSession } from '../../../_lib/auth'
import { isSameOrigin, json, readJsonObject } from '../../../_lib/http'
import { confirmVerificationCode } from '../../../_lib/verification'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return json({ error: 'Solicitud de origen no permitido.' }, 403)

  const session = await getAuthenticatedSession(request, env.DB)
  if (!session) return json({ error: 'Inicia sesión para continuar.' }, 401)

  const verifiedUser = { id: session.userId, email: session.email, emailVerified: true }
  if (session.emailVerified) return json({ user: verifiedUser })

  const body = await readJsonObject(request)
  const code = typeof body?.code === 'string' ? body.code.replace(/\s+/gu, '') : ''
  if (!/^\d{6}$/u.test(code)) {
    return json({ error: 'Ingresa el código de 6 dígitos que enviamos a tu correo.' }, 400)
  }

  const result = await confirmVerificationCode(env.DB, session.userId, code, Date.now())
  if (!result.ok) {
    if (result.reason === 'expired') {
      return json({ error: 'El código venció. Pide uno nuevo.', code: result.reason }, 400)
    }
    if (result.reason === 'locked') {
      return json({ error: 'Demasiados intentos. Pide un código nuevo.', code: result.reason }, 429)
    }
    if (result.reason === 'mismatch') {
      return json({
        error: `Código incorrecto. Te quedan ${result.remaining} intentos.`,
        code: result.reason,
        remaining: result.remaining,
      }, 400)
    }
    return json({ error: 'Pide un código nuevo para confirmar tu correo.', code: result.reason }, 400)
  }

  return json({ user: verifiedUser })
}
