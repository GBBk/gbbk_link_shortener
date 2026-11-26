import type { Url } from "@/types";

const SLUG_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

/** Código que identifica al link: el alias personalizado si existe, si no el generado. */
export function getLinkCode(url: Pick<Url, "short_url" | "custom_url">): string {
  return url.custom_url ? url.custom_url : url.short_url;
}

/** Link corto completo, usando el dominio donde está desplegada la app. */
export function buildShortLink(
  url: Pick<Url, "short_url" | "custom_url">,
  origin: string = window.location.origin,
): string {
  return `${origin.replace(/\/$/, "")}/${getLinkCode(url)}`;
}

/** Valida un alias o código corto antes de usarlo en una consulta. */
export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/** Genera un código corto aleatorio de `length` caracteres [a-z0-9]. */
export function generateShortCode(length = 6): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** Cuenta cuántas veces aparece cada valor de `key`, ordenado de mayor a menor. */
export function countBy<T>(
  items: T[],
  key: (item: T) => string | null | undefined,
  fallback = "Desconocido",
): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const name = key(item) || fallback;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count,
  );
}
