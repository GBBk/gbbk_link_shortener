export interface Url {
  id: string;
  title: string;
  original_url: string;
  short_url: string;
  custom_url: string | null;
  qr: string;
  user_id: string;
  created_at: string;
}

export interface Click {
  id: string;
  url_id: string;
  city: string | null;
  country: string | null;
  device: string | null;
  created_at: string;
}
