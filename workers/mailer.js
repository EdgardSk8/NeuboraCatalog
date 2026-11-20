/**
 * Worker interno de correo.
 *
 * Cloudflare Pages no acepta el binding `send_email` en su configuración, así
 * que este Worker expone el envío a las Pages Functions mediante un service
 * binding (`MAILER`). No tiene URL pública.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (request.method !== 'POST' || url.pathname !== '/send') {
      return new Response('Not found', { status: 404 })
    }

    let payload
    try {
      payload = await request.json()
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }

    const { to, from, subject, html, text } = payload ?? {}
    const validFrom = from && typeof from.email === 'string' && from.email.includes('@')
    const valid =
      typeof to === 'string' && to.includes('@') &&
      validFrom &&
      typeof subject === 'string' &&
      typeof html === 'string' &&
      typeof text === 'string'

    if (!valid) return new Response('Invalid payload', { status: 400 })
    if (!env.EMAIL) return new Response('Email binding missing', { status: 503 })

    try {
      await env.EMAIL.send({
        to,
        from: {
          email: from.email,
          name: typeof from.name === 'string' ? from.name : undefined,
        },
        subject,
        html,
        text,
      })
      return new Response('ok')
    } catch (error) {
      // Nunca registrar el contenido del correo ni el código de verificación.
      console.error('Email send failed', error instanceof Error ? error.name : 'unknown')
      return new Response('Send failed', { status: 502 })
    }
  },
}
