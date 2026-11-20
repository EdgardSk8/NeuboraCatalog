interface Env {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  // Cloudflare Email Sending. Sin este binding no se puede enviar el código
  // de confirmación y la cuenta queda pendiente de verificación.
  EMAIL?: SendEmail
  // Producción: Pages no admite send_email, así que el correo pasa por este
  // Worker interno con un service binding.
  MAILER?: Fetcher
  // Relay de Gmail (Google Apps Script) para enviar sin dominio propio.
  MAIL_RELAY_URL?: string
  MAIL_RELAY_SECRET?: string
  MAIL_FROM?: string
  MAIL_FROM_NAME?: string
}
