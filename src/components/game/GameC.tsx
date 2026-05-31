
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
      
      <Link to={`/account-listing/${account.id}`} className="block">

        <div className="w-full min-w-0 overflow-hidden rounded-lg shadow-md hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]  transition-all duration-300">
          <div className="relative group">
            {imageUrl ? (
              <img
                src={imageUrl ?? ""}
                alt={account.title}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            ) : (
              <div className="h-60 w-full bg-slate-900" />
            )}
            <p className="text-sm text-green-500 rounded-sm py-0.5 px-1 bg-green-600/20 mt-1 flex items-center gap-1 absolute top-2 right-2">
              <CircleCheckBig className="w-4 h-4" /> {formatSaleType(account.sale_type)}
            </p>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-2 border-b border-b-mauve-500 pb-2">
              <h3 className="text-md font-bold ">{account.title}</h3>
              <p className="text-sm text-gray-400">{formatDate(account.created_at)}</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className=" flex items-center gap-3">
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
                  <p className="truncate text-base font-bold text-white">
                    {seller?.username ?? "Seller"}
                  </p>
                  <p className="truncate text-sm font-medium text-slate-400">
                    Verified Seller
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <p className="text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 mr-2">
                  MMK {account.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );  
}
 
export default GameC;  
