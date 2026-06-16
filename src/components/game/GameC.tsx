import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router";

import type { Listing } from "@/lib/api";
import { getListingImageUrl } from "@/lib/api";

const formatDate = (date?: string | null) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB").format(new Date(date));
};

const formatSaleType = (saleType?: string | null) => {
  if (!saleType) {
    return "For sale";
  }

  return saleType.toLowerCase() == "rental" ? "For rental" : "For sale";
};

const GameC = ({ account }: { account: Listing }) => {
  const imageUrl = getListingImageUrl(account);
  const seller = account.seller;
    return (
      <Link
        to={`/accounts/${account.id}`}
        className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-800/80 shadow-md transition-all duration-300 hover:border-purple-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      >
        <div className="relative shrink-0 group">
          {imageUrl ? (
            <img
              src={imageUrl ?? ""}
              alt={account.title}
              className="h-48 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105 sm:h-52 md:h-56"
            />
          ) : (
            <div className="h-48 w-full bg-slate-900" />
          )}

          <p className="absolute right-2 top-2 flex items-center gap-1 rounded-sm bg-green-600/20 px-1 py-0.5 text-sm text-green-500">
            <CircleCheckBig className="h-4 w-4" />{" "}
            {formatSaleType(account.sale_type)}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2 border-b border-b-mauve-500 pb-2">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-base font-bold leading-snug text-white">
              {account.title}
            </h3>
            <p className="shrink-0 text-sm text-gray-400">
              {formatDate(account.created_at)}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="flex min-w-0 items-center gap-3">
              {seller?.profile_image_url ? (
                <img
                  src={seller.profile_image_url}
                  alt={`${seller.username} profile`}
                  className="h-12 w-12 shrink-0 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-full border border-slate-700 bg-slate-800" />
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white">Denoe</p>
                <p className="truncate text-sm font-medium text-slate-400">
                  {seller?.username ?? "Seller"}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-base font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 sm:text-lg">
              MMK {account.price}
            </p>
          </div>
        </div>
      </Link>
    );  
}
 
export default GameC;  