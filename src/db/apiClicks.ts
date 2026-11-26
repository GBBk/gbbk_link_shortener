import { UAParser } from "ua-parser-js";
import supabase from "./supabase";
import type { Click } from "@/types";

export async function getClicksForUrls(urlIds: string[]): Promise<Click[]> {
  const { data, error } = await supabase.from("clicks").select("*").in("url_id", urlIds);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const parser = new UAParser()

async function getLocation(): Promise<{ city: string | null; country: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch("https://ipapi.co/json", { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return { city: null, country: null };
    const { city, country_name } = await response.json();
    return { city: city ?? null, country: country_name ?? null };
  } catch {
    // Adblockers, límite de la API o timeout: el click se guarda igual, sin ubicación.
    return { city: null, country: null };
  }
}

/**
 * Registra el click y redirige SIEMPRE al link original,
 * aunque falle la geolocalización o el insert de estadísticas.
 */
export const storeClicks = async ({ id, originalUrl }: { id: string, originalUrl: string }) => {
  try {
    const device = parser.getResult().device.type || "desktop"
    const { city, country } = await getLocation()

    const { error } = await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    })
    if (error) console.error("Error recording click: ", error.message)
  } catch (error) {
    console.error("Error recording click: ", error)
  } finally {
    window.location.href = originalUrl
  }
}

export async function getClicksInfoForUrl(url_id: string): Promise<Click[]> {
  const { data, error } = await supabase.from("clicks").select("*").eq("url_id", url_id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
