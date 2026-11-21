-- La verificación por correo deja de ser obligatoria para crear una cuenta.
-- Las cuentas existentes que aún no habían confirmado quedan activas y se
-- descartan los códigos pendientes para evitar correos de verificación inútiles.
UPDATE users SET email_verified = 1 WHERE email_verified = 0;
DELETE FROM email_verification_codes;
