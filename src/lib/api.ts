export interface Seller {
  id: number;
  username?: string | null;
  role?: string | null;
  profile_image?: string | null;
  profile_image_url?: string | null;
  telegram?: string | null;
  messenger?: string | null;
  viber?: string | null;
  phone?: string | null;
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

export interface ListingImage {
  id: number;
  image: string;
  image_url?: string | null;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  buy_price?: number | string | null;
  sold_price?: number | string | null;
  rank?: string | null;
  server?: string | null;
  image?: string | null;
  image_url?: string | null;
  status: string;
  game_id: number;
  game?: string | null;
  featured: boolean;
  sale_type?: string | null;
  created_at?: string | null;
  sold_at?: string | null;
  seller_id?: number | null;
  seller?: Seller | null;
  detail_images?: ListingImage[];
}

export interface ListingDetails extends Listing {
  images: ListingImage[];
}

export interface HomeData {
  games: Game[];
  mobile_legends_listings: Listing[];
  pubg_listings: Listing[];
}

export interface ListingsResponse {
  items?: Listing[];
  listings?: Listing[];
  page: number;
  pages: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
  per_page?: number;
}

export interface AdminListingsResponse {
  listings: Listing[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AdminDashboard {
  total_listings: number;
  available_listings: number;
  sold_listings: number;
  recent_listings: Listing[];
  total_spending: number;
  total_revenue: number;
  total_profit: number;
  profit_labels: string[];
  profit_values: number[];
}

export type ListingParams = {
  search?: string;
  game_id?: string;
  sort?: string;
  min_price?: string;
  max_price?: string;
  page?: string;
  status?: string;
  featured?: string;
};

export type CreateGamePayload = {
  name: string;
  telegram?: string;
  messenger?: string;
  viber?: string;
  phone?: string;
};

export type UpdateListingPayload = {
  title?: string;
  description?: string;
  price?: string | number;
  rank?: string;
  server?: string;
  game_id?: string | number;
};

export type UpdateProfilePayload = {
  telegram?: string;
  messenger?: string;
  viber?: string;
  phone?: string;
  profile_image?: File | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const buildApiUrl = (path: string, params?: Record<string, string | undefined>) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim()) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, string | undefined>
): Promise<T> => {
  const response = await fetch(buildApiUrl(path, params), {
    credentials: "include",
    headers:
      options.body instanceof FormData
        ? options.headers
        : {
            "Content-Type": "application/json",
            ...options.headers,
          },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed (${response.status})`);
  }

  return data as T;
};

/* Public API */

export const getListings = async (
  params?: Record<string, string>
): Promise<ListingsResponse> => {
  return requestJson<ListingsResponse>("/api/listings", {}, params);
};

export const getListing = async (
  id: number | string
): Promise<ListingDetails> => {
  return requestJson<ListingDetails>(`/api/listings/${id}`);
};

export const getGames = async (): Promise<Game[]> => {
  return requestJson<Game[]>("/api/games");
};

export const getHomeData = async (search = ""): Promise<HomeData> => {
  return requestJson<HomeData>("/api/home", {}, { search });
};

/* Admin API */

export const getAdminGames = async (): Promise<Game[]> => {
  const data = await requestJson<{ games: Game[] }>("/api/admin/games");
  return data.games;
};

export const createAdminGame = async (
  payload: CreateGamePayload
): Promise<Game> => {
  const data = await requestJson<{ message: string; game: Game }>(
    "/api/admin/games",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return data.game;
};

export const getAdminListings = async (
  params?: ListingParams
): Promise<AdminListingsResponse> => {
  return requestJson<AdminListingsResponse>("/api/admin/listings", {}, params);
};

export const getAdminListing = async (
  id: number | string
): Promise<Listing> => {
  const data = await requestJson<{ listing: Listing }>(
    `/api/admin/listings/${id}`
  );

  return data.listing;
};

export const createAdminListing = async (
  formData: FormData
): Promise<Listing> => {
  const data = await requestJson<{ message: string; listing: Listing }>(
    "/api/admin/listings",
    {
      method: "POST",
      body: formData,
    }
  );

  return data.listing;
};

export const updateAdminListing = async (
  id: number | string,
  payload: UpdateListingPayload
): Promise<Listing> => {
  const data = await requestJson<{ message: string; listing: Listing }>(
    `/api/admin/listings/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  return data.listing;
};

export const deleteAdminListing = async (
  id: number | string
): Promise<{ message: string }> => {
  return requestJson<{ message: string }>(`/api/admin/listings/${id}`, {
    method: "DELETE",
  });
};

export const markAdminListingSold = async (
  id: number | string,
  sold_price: string | number
): Promise<Listing> => {
  const data = await requestJson<{ message: string; listing: Listing }>(
    `/api/admin/listings/${id}/mark-sold`,
    {
      method: "PATCH",
      body: JSON.stringify({ sold_price }),
    }
  );

  return data.listing;
};

export const toggleAdminListingFeatured = async (
  id: number | string
): Promise<Listing> => {
  const data = await requestJson<{ message: string; listing: Listing }>(
    `/api/admin/listings/${id}/toggle-featured`,
    {
      method: "PATCH",
    }
  );

  return data.listing;
};

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  return requestJson<AdminDashboard>("/api/admin/dashboard");
};

export const getAdminProfile = async (): Promise<Seller> => {
  const data = await requestJson<{ user: Seller }>("/api/admin/profile");
  return data.user;
};

export const updateAdminProfile = async (
  payload: UpdateProfilePayload
): Promise<Seller> => {
  const formData = new FormData();

  if (payload.telegram) formData.append("telegram", payload.telegram);
  if (payload.messenger) formData.append("messenger", payload.messenger);
  if (payload.viber) formData.append("viber", payload.viber);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.profile_image) {
    formData.append("profile_image", payload.profile_image);
  }

  const data = await requestJson<{ message: string; user: Seller }>(
    "/api/admin/profile",
    {
      method: "PUT",
      body: formData,
    }
  );

  return data.user;
};

/* Image helpers */

export const getImageUrl = (image?: string | null) => {
  if (!image) {
    return null;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_BASE_URL}/static/uploads/${image}`;
};

export const getListingImageUrl = (
  listing: Pick<Listing, "image" | "image_url">
) => {
  return listing.image_url ?? getImageUrl(listing.image);
};