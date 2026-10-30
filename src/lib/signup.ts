import { NETLIFY_FORM_NAME } from "../siteConfig";

/*
  Early-access registration via Netlify Forms (AJAX pattern from
  docs.netlify.com/manage/forms/setup/). Netlify only accepts the POST once
  the site is deployed there and the static twin form in index.html has
  been detected by a build.

  VITE_SIGNUP_PROVIDER is set to "netlify" in netlify.toml for Netlify
  builds only. Anywhere else (local dev, another host) it is unset, and the
  form says plainly that signup isn't connected instead of POSTing to a
  server that can't record it — a SPA fallback would answer that POST with
  200 and index.html, which would otherwise look like success.
*/
export const SIGNUP_CONNECTED = import.meta.env.VITE_SIGNUP_PROVIDER === "netlify";

export type Role = "ca_firm" | "restaurant_operator" | "other" | "";

export type SignupOutcome =
  | { kind: "ok" }
  | { kind: "duplicate" }
  | { kind: "not-connected" }
  | { kind: "error" };

const WHATSAPP_PATTERN = /^\+?[0-9 ()-]{7,16}$/;

export function validateWhatsapp(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null; // optional
  return WHATSAPP_PATTERN.test(trimmed) ? null : "That doesn't look like a phone number — or leave it empty.";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(trimmed)) return "That doesn't look like a complete email address.";
  return null;
}

// Netlify Forms has no server-side dedupe, so this only stops the same
// browser registering the same address twice. Wrapped in try/catch because
// storage can be unavailable (private mode, blocked site data).
const STORAGE_KEY = "shubhmel:registered-emails";

function registeredHere(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function rememberRegistration(email: string) {
  try {
    const list = registeredHere();
    if (!list.includes(email)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, email]));
  } catch {
    // Not being able to remember is harmless; the registration still went through.
  }
}

export async function registerForEarlyAccess(input: {
  email: string;
  role: Role;
  whatsapp: string;
  source: string;
  botField: string;
}): Promise<SignupOutcome> {
  if (!SIGNUP_CONNECTED) return { kind: "not-connected" };

  const email = input.email.trim().toLowerCase();
  if (registeredHere().includes(email)) return { kind: "duplicate" };

  const body = new URLSearchParams({
    "form-name": NETLIFY_FORM_NAME,
    email,
    role: input.role,
    whatsapp: input.whatsapp.trim(),
    source: input.source,
    "bot-field": input.botField,
  });

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) return { kind: "error" };
    rememberRegistration(email);
    return { kind: "ok" };
  } catch {
    return { kind: "error" };
  }
}
