interface Env {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  // Cloudflare Email Sending. Sin este binding no se puede enviar el código
  // de confirmación y la cuenta queda pendiente de verificación.
  EMAIL?: SendEmail
  MAIL_FROM?: string
  MAIL_FROM_NAME?: string
}
