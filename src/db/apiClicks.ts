import {UAParser} from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds: string[]) {
  const { data, error } = await supabase.from("clicks").select("*").in("url_id", urlIds);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const parser = new UAParser()

export const storeClicks = async ({ id, originalUrl }: {id: string, originalUrl: string}) => {
  try {
    const res = parser.getResult()
    const device = res.device.type || "desktop"

    const response = await fetch("https://ipapi.co/json")
    const {city, country_name: country} = await response.json()

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device
    })

    window.location.href = originalUrl
  } catch (error) {
    console.error("Error recording click: ", error)
  }
}

export async function getClicksInfoForUrl(url_id: string) {
  const { data, error } = await supabase.from("clicks").select("*").eq("url_id", url_id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
