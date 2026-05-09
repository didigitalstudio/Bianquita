/**
 * Map common Supabase auth error messages to user-friendly Spanish copy.
 * Use translateAuthError(err.message) wherever supabase.auth.* throws.
 */

const SUPABASE_AUTH_ERRORS: Record<string, string> = {
  // signInWithPassword
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "Email not confirmed": "Tenés que confirmar tu email antes de ingresar. Revisá tu casilla.",
  "Email rate limit exceeded": "Demasiados intentos. Probá en unos minutos.",
  "User not found": "No existe una cuenta con ese email.",

  // signUp
  "User already registered": "Ya existe una cuenta con ese email. Probá iniciar sesión.",
  "Signup requires a valid password": "La contraseña no es válida.",
  "Password should be at least 6 characters.": "La contraseña debe tener al menos 8 caracteres.",
  "Password should be at least 8 characters.": "La contraseña debe tener al menos 8 caracteres.",
  "Unable to validate email address: invalid format": "El email no tiene un formato válido.",
  "For security purposes, you can only request this after 60 seconds.":
    "Por seguridad, esperá 60 segundos antes de volver a intentar.",

  // resetPasswordForEmail
  "Email link is invalid or has expired":
    "El link de recuperación es inválido o ya expiró. Pedí uno nuevo.",

  // updateUser (on reset)
  "New password should be different from the old password.":
    "La contraseña nueva tiene que ser distinta a la anterior.",
  "Auth session missing!":
    "El link expiró o ya fue usado. Pedí un nuevo email de recuperación.",
};

export function translateAuthError(message: string | undefined | null): string {
  if (!message) return "Algo salió mal. Probá de nuevo.";
  return SUPABASE_AUTH_ERRORS[message] ?? "Algo salió mal. Probá de nuevo.";
}
