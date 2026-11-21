import { CODE_TTL_MINUTES } from './verification'

const DEFAULT_FROM_ADDRESS = 'tellezsoftware@gmail.com'
const DEFAULT_FROM_NAME = 'TellezSoftware'
const EMAIL_FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"

type VerificationEmail = {
  subject: string
  html: string
  text: string
}

type VerificationEmailCopy = {
  htmlLang: string
  subject: string
  preheader: string
  heading: string
  intro: string
  validity: string
  security: string
  thanks: string
  footer: string
  copyLabel: string
  text: string[]
}

function renderVerificationEmail(
  copy: VerificationEmailCopy,
  code: string,
  copyUrl: string,
  baseUrl: string,
): string {
  return `<!doctype html>
<html lang="${copy.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${copy.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:#24292e;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${copy.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
      <tr>
        <td align="center" valign="top" style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:544px;margin:0 auto;font-family:${EMAIL_FONT};">
            <tr>
              <td align="center" style="padding:0;">
                <a href="${baseUrl}" style="text-decoration:none;">
                  <img src="${baseUrl}/logo.png" alt="Noubora Catalog" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;" />
                </a>
                <h2 style="margin:8px 0 0;color:#24292e;font-size:24px;font-weight:400;line-height:1.25;font-family:${EMAIL_FONT};text-align:center;">${copy.heading}</h2>
              </td>
            </tr>
            <tr>
              <td height="16" style="font-size:16px;line-height:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="border:1px solid #e1e4e8;border-radius:6px;padding:16px;text-align:center;font-family:${EMAIL_FONT};">
                <p style="margin:0 0 8px;color:#24292e;font-size:14px;line-height:1.5;">${copy.intro}</p>
                <p style="margin:0 0 8px;">
                  <a href="${copyUrl}" style="display:inline-block;color:#24292e;font-size:24px;line-height:1.5;letter-spacing:4px;text-decoration:none;font-family:${EMAIL_FONT};">${code}</a>
                </p>
                <p style="margin:0 0 8px;color:#24292e;font-size:14px;line-height:1.5;">${copy.validity}</p>
                <p style="margin:0;color:#24292e;font-size:14px;line-height:1.5;">${copy.security}</p>
                <p style="margin:12px 0 0;font-size:14px;line-height:1.5;">
                  <a href="${copyUrl}" style="color:#0366d6;text-decoration:none;">${copy.copyLabel}</a>
                </p>
                <p style="margin:16px 0 0;color:#24292e;font-size:14px;line-height:1.5;">${copy.thanks}</p>
              </td>
            </tr>
            <tr>
              <td height="16" style="font-size:16px;line-height:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="color:#6a737d;font-size:14px;line-height:1.5;font-family:${EMAIL_FONT};text-align:left;">${copy.footer}</td>
            </tr>
            <tr>
              <td height="16" style="font-size:16px;line-height:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="color:#6a737d;font-size:12px;line-height:1.5;font-family:${EMAIL_FONT};text-align:left;">
                TellezSoftware · Noubora Catalog<br />
                <a href="mailto:tellezsoftware@gmail.com" style="color:#0366d6;text-decoration:none;">tellezsoftware@gmail.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function buildVerificationEmail(code: string, language: string, origin: string): VerificationEmail {
  const minutes = CODE_TTL_MINUTES
  const baseUrl = origin.replace(/\/+$/u, '')
  const copyUrl = `${baseUrl}/copiar-codigo#${code}`

  const copy: VerificationEmailCopy = language === 'en'
    ? {
        htmlLang: 'en',
        subject: '[TellezSoftware] Noubora Catalog verification code',
        preheader: `Your confirmation code expires in ${minutes} minutes.`,
        heading: 'Confirm your email address',
        intro: 'Here is your <strong>Noubora Catalog</strong> confirmation code:',
        validity: `This code is valid for <strong>${minutes} minutes</strong> and can only be used once.`,
        security: "<strong>Please don't share this code with anyone:</strong> we'll never ask for it on the phone or via email.",
        thanks: 'Thanks,<br />The TellezSoftware Team',
        footer: "You're receiving this email because a verification code was requested for your Noubora Catalog account. If this wasn't you, please ignore this email.",
        copyLabel: 'Copy code',
        text: [
          'Confirm your email address',
          '',
          'Here is your Noubora Catalog confirmation code:',
          code,
          '',
          `Copy code: ${copyUrl}`,
          '',
          `This code is valid for ${minutes} minutes and can only be used once.`,
          "Please don't share this code with anyone: we'll never ask for it on the phone or via email.",
          '',
          'Thanks,',
          'The TellezSoftware Team',
          '',
          "You're receiving this email because a verification code was requested for your Noubora Catalog account. If this wasn't you, please ignore this email.",
          '',
          'TellezSoftware · Noubora Catalog',
          'tellezsoftware@gmail.com',
        ],
      }
    : {
        htmlLang: 'es',
        subject: '[TellezSoftware] Código de verificación de Noubora Catalog',
        preheader: `Tu código de confirmación vence en ${minutes} minutos.`,
        heading: 'Confirma tu correo electrónico',
        intro: 'Este es tu código de confirmación de <strong>Noubora Catalog</strong>:',
        validity: `Este código es válido por <strong>${minutes} minutos</strong> y solo se puede usar una vez.`,
        security: '<strong>No compartas este código con nadie:</strong> nunca te lo pediremos por teléfono ni por correo.',
        thanks: 'Gracias,<br />El equipo de TellezSoftware',
        footer: 'Recibiste este correo porque se solicitó un código de verificación para tu cuenta de Noubora Catalog. Si no fuiste tú, ignora este mensaje.',
        copyLabel: 'Copiar código',
        text: [
          'Confirma tu correo electrónico',
          '',
          'Este es tu código de confirmación de Noubora Catalog:',
          code,
          '',
          `Copiar código: ${copyUrl}`,
          '',
          `Este código es válido por ${minutes} minutos y solo se puede usar una vez.`,
          'No compartas este código con nadie: nunca te lo pediremos por teléfono ni por correo.',
          '',
          'Gracias,',
          'El equipo de TellezSoftware',
          '',
          'Recibiste este correo porque se solicitó un código de verificación para tu cuenta de Noubora Catalog. Si no fuiste tú, ignora este mensaje.',
          '',
          'TellezSoftware · Noubora Catalog',
          'tellezsoftware@gmail.com',
        ],
      }

  return {
    subject: copy.subject,
    html: renderVerificationEmail(copy, code, copyUrl, baseUrl),
    text: copy.text.join('\n'),
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

async function sendWithRelay(env: Env, payload: MailerPayload): Promise<boolean> {
  const url = env.MAIL_RELAY_URL?.trim()
  const secret = env.MAIL_RELAY_SECRET?.trim()
  if (!url || !secret) return false

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret,
        to: payload.to,
        from: payload.from.email,
        fromName: payload.from.name,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    })
    if (!response.ok) {
      console.error('El relay de Gmail rechazó el envío.', response.status)
      return false
    }
    const result = await response.json().catch(() => null) as { ok?: boolean } | null
    if (!result?.ok) {
      console.error('El relay de Gmail no confirmó el envío.')
      return false
    }
    return true
  } catch (error) {
    console.error('No se pudo contactar al relay de Gmail.', error instanceof Error ? error.name : 'unknown')
    return false
  }
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

export async function sendVerificationEmail(env: Env, to: string, code: string, language: string, origin: string): Promise<boolean> {
  const message = buildVerificationEmail(code, language, origin)
  const payload: MailerPayload = {
    to,
    from: resolveSender(env),
    subject: message.subject,
    html: message.html,
    text: message.text,
  }

  // Gmail (Apps Script) es el canal principal cuando está configurado.
  if (env.MAIL_RELAY_URL && env.MAIL_RELAY_SECRET) return sendWithRelay(env, payload)

  // Alternativa con dominio propio: Worker + Cloudflare Email Sending.
  if (env.MAILER) return sendWithMailerWorker(env, payload)

  if (!env.EMAIL) {
    console.warn('La verificación de correo requiere MAIL_RELAY_URL/SECRET, MAILER o EMAIL.')
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
