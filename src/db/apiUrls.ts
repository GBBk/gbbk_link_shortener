import supabase, { supabaseUrl } from "./supabase";
import { generateShortCode, isValidSlug } from "@/lib/links";
import type { Url } from "@/types";

export async function getUrls(user_id: string): Promise<Url[]> {
  const { data, error } = await supabase.from("urls").select("*").eq("user_id", user_id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteUrl(id: string) {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function isCodeTaken(code: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("urls")
    .select("id", { count: "exact", head: true })
    .or(`short_url.eq.${code},custom_url.eq.${code}`);
  if (error) {
    throw new Error(error.message);
  }
  return (count ?? 0) > 0;
}

interface CreateUrlParams {
  title: string;
  longUrl: string;
  customUrl?: string;
  user_id: string;
}

export async function createUrl({ title, longUrl, customUrl, user_id }: CreateUrlParams, qrcode: Blob | null): Promise<Url[]> {
  const custom = customUrl?.trim() || null;
  if (custom) {
    if (!isValidSlug(custom)) {
      throw new Error("El alias solo puede tener letras, números, guiones y guion bajo.");
    }
    if (await isCodeTaken(custom)) {
      throw new Error("Ese alias ya está en uso, probá con otro.");
    }
  }

  // Reintenta si el código aleatorio ya existe (muy improbable, pero posible).
  let short_url = generateShortCode();
  for (let attempt = 0; attempt < 5 && (await isCodeTaken(short_url)); attempt++) {
    short_url = generateShortCode();
  }

  if (!qrcode) {
    throw new Error("No se pudo generar el código QR.");
  }

  const fileName = `qr-${short_url}`;
  const { error: storageError } = await supabase.storage.from("qrs").upload(fileName, qrcode);
  if (storageError) {
    throw new Error(storageError.message);
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase.from("urls").insert([
    { title, original_url: longUrl, short_url, custom_url: custom, user_id, qr }
  ]).select()
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getLongUrl(id: string): Promise<Pick<Url, "id" | "original_url">> {
  // Validar antes de interpolar evita que el parámetro de la URL altere el filtro de la consulta.
  if (!isValidSlug(id)) {
    throw new Error("Link inválido");
  }
  const { data, error } = await supabase.from("urls").select("id, original_url").or(`short_url.eq.${id},custom_url.eq.${id}`).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getUrlInfo({ id, user_id }: { id: string | undefined, user_id: string }): Promise<Url> {
  const { data, error } = await supabase.from("urls").select("*").eq("id", id).eq("user_id", user_id).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
