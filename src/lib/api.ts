export interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  rank?: string | null;
  server?: string | null;
  image?: string | null;
  image_url?: string | null;
  status: string;
  game_id: number;
  game: string;
  featured: boolean;
  sale_type?: string | null;
  created_at?: string | null;
  seller_id?: number | null;
  seller?: Seller | null;
}

export interface Game {
  id: number;
  name: string;
  image?: string | null;
  image_url?: string | null;
  telegram?: string | null;
  messenger?: string | null;
  viber?: string | null;
  phone?: string | null;
}

export interface Seller {
  id: number;
  username: string;
  role: string;
  profile_image?: string | null;
  profile_image_url?: string | null;
  telegram?: string | null;
  messenger?: string | null;
  viber?: string | null;
  phone?: string | null;
}

export interface ListingImage {
  id: number;
  image: string;
  image_url: string;
}

export interface ListingDetails extends Listing {
  buy_price?: number | null;
  sold_price?: number | null;
  sold_at?: string | null;
  seller?: Seller | null;
  images: ListingImage[];
}

export interface HomeData {
  games: Game[];
  mobile_legends_listings: Listing[];
  pubg_listings: Listing[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const buildApiUrl = (path: string, params?: Record<string, string>) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value.trim()) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

export const getListings = async (search = ""): Promise<Listing[]> => {
  const response = await fetch(buildApiUrl("/api/listings", { search }));

  if (!response.ok) {
    throw new Error(`Unable to load listings (${response.status})`);
  }

  return response.json();
};

export const getListing = async (id: number | string): Promise<ListingDetails> => {
  const response = await fetch(buildApiUrl(`/api/listings/${id}`));

  if (!response.ok) {
    throw new Error(`Unable to load listing (${response.status})`);
  }

  return response.json();
};

export const getGames = async (): Promise<Game[]> => {
  const response = await fetch(buildApiUrl("/api/games"));

  if (!response.ok) {
    throw new Error(`Unable to load games (${response.status})`);
  }

  return response.json();
};

export const getHomeData = async (search = ""): Promise<HomeData> => {
  const response = await fetch(buildApiUrl("/api/home", { search }));

  if (!response.ok) {
    throw new Error(`Unable to load home data (${response.status})`);
  }

  return response.json();
};

export const getImageUrl = (image?: string | null) => {
  if (!image) {
    return null;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_BASE_URL}/static/uploads/${image}`;
};

export const getListingImageUrl = (listing: Pick<Listing, "image" | "image_url">) => {
  return listing.image_url ?? getImageUrl(listing.image);
};
