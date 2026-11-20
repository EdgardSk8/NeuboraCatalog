PRAGMA foreign_keys = ON;

-- Códigos de confirmación de identidad para cuentas creadas manualmente.
-- Se guarda solo el hash del código: nunca el código en claro.
CREATE TABLE email_verification_codes (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_sent_at TEXT NOT NULL,
  sends INTEGER NOT NULL DEFAULT 1 CHECK (sends >= 1),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);

CREATE INDEX email_verification_expiry_idx ON email_verification_codes(expires_at);

-- Las cuentas creadas antes de existir la verificación quedan confirmadas:
-- la regla aplica a los registros nuevos.
UPDATE users SET email_verified = 1 WHERE email_verified = 0;
