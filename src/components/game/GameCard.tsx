
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

const GameCard = ({ account }: { account: Listing }) => {
    const imageUrl = getListingImageUrl(account);
    const seller = account.seller;

    return (
      
      <Link to={`/accounts/${account.id}`} className="block">

        <div className="block w-full min-w-0 overflow-hidden rounded-lg shadow-md hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]  transition-all duration-300">
          <div className="relative group">
            {imageUrl ? (
              <img
                src={imageUrl ?? ""}
                alt={account.title}
                  className="w-full h-40 sm:h-60 xs:h-35 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            ) : (
              <div className="h-60 w-full bg-slate-900" />
            )}
            <p className="text-sm text-green-500 rounded-sm py-0.5 px-1 bg-green-600/20 mt-1 flex items-center gap-1 absolute top-2 right-2">
              <CircleCheckBig className="w-4 h-4" /> {formatSaleType(account.sale_type)}
            </p>
          </div>

          <div className="p-2 sm:p-4">
            <div className="flex items-center justify-between gap-2 border-b border-b-mauve-500 pb-2">
              <h3 className="sm:text-lg xs:text-[10px] font-bold ">{account.title}</h3>
              <p className="sm:text-sm xs:text-[10px] text-gray-400">{formatDate(account.created_at)}</p>
            </div>

            <div className="sm:mt-4 mt-2 flex items-center justify-between md:gap-15  sm:gap-10 xs:gap-3">
              <div className="flex items-center gap-1 sm:gap-3">
                {seller?.profile_image_url ? (
                  <img
                    src={seller.profile_image_url}
                    alt={`${seller.username} profile`}
                    className="sm:h-12 sm:w-12 xs:h-8 xs:w-8 shrink-0 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-full border border-slate-700 bg-slate-800" />
                )}
                <div className="min-w-0">
                  <p className="truncate sm:text-base xs:text-[9px] text-sm font-bold text-white">
                    {seller?.username ?? "Seller"}
                  </p>
                  <p className="truncate sm:text-sm xs:text-[9px] font-medium text-slate-400">
                    Verified Seller
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="sm:text-lg xs:text-[10px] tracking-wider text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-rose-400 ">
                  MMK {account.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );  
}
 
export default GameCard;  
