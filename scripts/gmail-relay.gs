/**
 * Relay de correo de Noubora Catalog sobre Gmail.
 *
 * Pasos:
 * 1. Abre https://script.google.com con la cuenta tellezsoftware@gmail.com.
 * 2. Nuevo proyecto y pega este archivo.
 * 3. Cambia SECRET por una cadena larga y aleatoria (mínimo 32 caracteres).
 * 4. Implementar → Nueva implementación → Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 5. Copia la URL /exec y configúrala en Cloudflare:
 *    npx wrangler pages secret put MAIL_RELAY_URL --project-name nouboracatalog
 *    npx wrangler pages secret put MAIL_RELAY_SECRET --project-name nouboracatalog
 *
 * La URL del Web App es pública; el secreto impide que terceros la usen.
 * Cuota aproximada de Gmail: 100 destinatarios por día en cuentas de consumidor.
 */

const SECRET = 'CAMBIA_ESTE_SECRETO_POR_UNO_LARGO_Y_ALEATORIO'
const FROM_NAME = 'Noubora Catalog'

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respond({ ok: false, error: 'missing_body' })
    }

    const data = JSON.parse(e.postData.contents)
    if (typeof data.secret !== 'string' || data.secret !== SECRET) {
      return respond({ ok: false, error: 'forbidden' })
    }

    const to = String(data.to || '').trim()
    const subject = String(data.subject || '').trim()
    const html = String(data.html || '')
    const text = String(data.text || '')
    const fromName = String(data.fromName || FROM_NAME).slice(0, 80)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return respond({ ok: false, error: 'invalid_to' })
    }
    if (!subject || subject.length > 180) {
      return respond({ ok: false, error: 'invalid_subject' })
    }
    if (!html || html.length > 100000 || text.length > 50000) {
      return respond({ ok: false, error: 'invalid_body' })
    }

    MailApp.sendEmail({
      to,
      subject,
      htmlBody: html,
      body: text,
      name: fromName,
    })

    return respond({ ok: true })
  } catch (error) {
    // Nunca registrar el código de verificación ni el contenido del correo.
    console.error(error)
    return respond({ ok: false, error: 'send_failed' })
  }
}

function respond(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON)
}
