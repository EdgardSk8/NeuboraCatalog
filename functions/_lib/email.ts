import { CODE_TTL_MINUTES } from './verification'

const DEFAULT_FROM_ADDRESS = 'no-reply@noubora.com'
const DEFAULT_FROM_NAME = 'Noubora Catalog'

type VerificationEmail = {
  subject: string
  html: string
  text: string
}

export function buildVerificationEmail(code: string, language: string): VerificationEmail {
  const minutes = CODE_TTL_MINUTES
  if (language === 'en') {
    return {
      subject: `${code} is your Noubora Catalog confirmation code`,
      text: [
        'Confirm your email address',
        '',
        `Your confirmation code is ${code}.`,
        `It expires in ${minutes} minutes and can be used once.`,
        '',
        'If you did not create this account, ignore this message.',
      ].join('\n'),
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f5faf8;font-family:'Segoe UI',system-ui,sans-serif;color:#293a33">
    <div style="max-width:420px;margin:0 auto;padding:16px;border:1px solid #e2efe9;border-radius:14px;background:#ffffff">
      <p style="margin:0 0 4px;color:#106a40;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Noubora Catalog</p>
      <h1 style="margin:0 0 8px;font-size:18px;line-height:1.2">Confirm your email address</h1>
      <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#5c6b61">Enter this code to finish creating your account:</p>
      <p style="margin:0 0 12px;padding:12px;border-radius:10px;background:#ecfaf3;color:#106a40;font-size:22px;font-weight:700;letter-spacing:.35em;text-align:center">${code}</p>
      <p style="margin:0;font-size:11px;line-height:1.5;color:#89968e">The code expires in ${minutes} minutes and can be used once. If you did not create this account, ignore this message.</p>
    </div>
  </body>
</html>`,
    }
  }

  return {
    subject: `${code} es tu código de confirmación de Noubora Catalog`,
    text: [
      'Confirma tu correo electrónico',
      '',
      `Tu código de confirmación es ${code}.`,
      `Vence en ${minutes} minutos y se puede usar una sola vez.`,
      '',
      'Si no creaste esta cuenta, ignora este mensaje.',
    ].join('\n'),
    html: `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f5faf8;font-family:'Segoe UI',system-ui,sans-serif;color:#293a33">
    <div style="max-width:420px;margin:0 auto;padding:16px;border:1px solid #e2efe9;border-radius:14px;background:#ffffff">
      <p style="margin:0 0 4px;color:#106a40;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Noubora Catalog</p>
      <h1 style="margin:0 0 8px;font-size:18px;line-height:1.2">Confirma tu correo electrónico</h1>
      <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#5c6b61">Escribe este código para terminar de crear tu cuenta:</p>
      <p style="margin:0 0 12px;padding:12px;border-radius:10px;background:#ecfaf3;color:#106a40;font-size:22px;font-weight:700;letter-spacing:.35em;text-align:center">${code}</p>
      <p style="margin:0;font-size:11px;line-height:1.5;color:#89968e">El código vence en ${minutes} minutos y se puede usar una sola vez. Si no creaste esta cuenta, ignora este mensaje.</p>
    </div>
  </body>
</html>`,
  }
}

export function resolveSender(env: Env): { email: string; name: string } {
  const email = (env.MAIL_FROM ?? DEFAULT_FROM_ADDRESS).trim()
  const name = (env.MAIL_FROM_NAME ?? DEFAULT_FROM_NAME).trim()
  return { email, name: name || DEFAULT_FROM_NAME }
}

type MailerPayload = {
  to: string
  from: { email: string; name: string }
  subject: string
  html: string
  text: string
}

async function sendWithMailerWorker(env: Env, payload: MailerPayload): Promise<boolean> {
  if (!env.MAILER) return false

  try {
    const response = await env.MAILER.fetch('https://nouboracatalog-mailer/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.error('El Worker de correo rechazó el envío.', response.status)
      return false
    }
    return true
  } catch (error) {
    console.error('No se pudo contactar al Worker de correo.', error instanceof Error ? error.name : 'unknown')
    return false
  }
}

export async function sendVerificationEmail(env: Env, to: string, code: string, language: string): Promise<boolean> {
  const message = buildVerificationEmail(code, language)
  const payload: MailerPayload = {
    to,
    from: resolveSender(env),
    subject: message.subject,
    html: message.html,
    text: message.text,
  }

  // Pages no admite `send_email`: en producción el envío pasa por el Worker.
  if (env.MAILER) return sendWithMailerWorker(env, payload)

  if (!env.EMAIL) {
    console.warn('La verificación de correo requiere el binding MAILER (producción) o EMAIL (local).')
    return false
  }

  try {
    await env.EMAIL.send(payload)
    return true
  } catch (error) {
    // Nunca registrar el código: es una credencial de un solo uso.
    console.error('No se pudo enviar el correo de confirmación.', error instanceof Error ? error.name : 'unknown')
    return false
  }
}
