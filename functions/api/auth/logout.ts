import { readSessionToken } from '../../_lib/auth'
import { isHttpsRequest, isSameOrigin, json, sessionCookie, sha256 } from '../../_lib/http'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return json({ error: 'Solicitud de origen no permitido.' }, 403)

  const token = readSessionToken(request)
  if (token) {
    const tokenHash = await sha256(token)
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(tokenHash).run()
  }

  return json({ success: true }, 200, { 'Set-Cookie': sessionCookie('', 0, isHttpsRequest(request)) })
}
