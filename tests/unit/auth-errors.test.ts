import { describe, expect, it } from "vitest";
import { translateAuthError } from "@/lib/auth-errors";

describe("translateAuthError", () => {
  it("translates known signIn errors", () => {
    expect(translateAuthError("Invalid login credentials")).toMatch(/incorrectos/i);
    expect(translateAuthError("Email not confirmed")).toMatch(/confirmar tu email/i);
  });

  it("translates known signUp errors", () => {
    expect(translateAuthError("User already registered")).toMatch(/Ya existe/i);
  });

  it("translates rate-limit errors with timing hint", () => {
    expect(translateAuthError("For security purposes, you can only request this after 60 seconds.")).toMatch(/60 segundos/);
  });

  it("translates reset-password / updateUser errors", () => {
    expect(translateAuthError("New password should be different from the old password.")).toMatch(/distinta/i);
    expect(translateAuthError("Auth session missing!")).toMatch(/expir/i);
  });

  it("returns a generic Spanish message for unknown errors (does NOT leak the original)", () => {
    const result = translateAuthError("Some weird internal Supabase error blah");
    expect(result).toBe("Algo salió mal. Probá de nuevo.");
    expect(result).not.toContain("weird");
    expect(result).not.toContain("Supabase");
  });

  it("handles null / undefined / empty string", () => {
    expect(translateAuthError(null)).toBe("Algo salió mal. Probá de nuevo.");
    expect(translateAuthError(undefined)).toBe("Algo salió mal. Probá de nuevo.");
    expect(translateAuthError("")).toBe("Algo salió mal. Probá de nuevo.");
  });
});
