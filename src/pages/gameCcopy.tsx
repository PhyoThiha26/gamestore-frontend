// import { CircleCheckBig } from "lucide-react";
// import { Link } from "react-router";

// import type { Listing } from "@/lib/api";
// import { getListingImageUrl } from "@/lib/api";

// const formatDate = (date?: string | null) => {
//   if (!date) return "";

//   return new Intl.DateTimeFormat("en-GB").format(new Date(date));
// };

// const formatSaleType = (saleType?: string | null) => {
//   if (!saleType) return "For sale";

//   return saleType.toLowerCase() === "rental" ? "For rental" : "For sale";
// };

// const GameCard = ({ account }: { account: Listing }) => {
//   const imageUrl = getListingImageUrl(account);
//   const seller = account.seller;

//   return (
//     <Link
//       to={`/accounts/${account.id}`}
//       className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg shadow-md hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]  transition-all duration-300"
//     >
//       <div className="group relative shrink-0 overflow-hidden">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={account.title}
//             className="h-40 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105 xs:h-35 sm:h-60"
//           />
//         ) : (
//           <div className="h-40 w-full bg-slate-900 xs:h-35 sm:h-60" />
//         )}

//         <p className="absolute right-2 top-2 flex items-center gap-1 rounded-sm bg-green-600/20 px-1 py-0.5 text-sm text-green-500">
//           <CircleCheckBig className="h-4 w-4" />
//           {formatSaleType(account.sale_type)}
//         </p>
//       </div>

//       <div className="flex flex-1 flex-col p-2 sm:p-4">
//         <div className="flex items-start justify-between gap-2 border-b border-b-mauve-500 pb-2">
//           <h3 className="line-clamp-2 min-w-0 flex-1 font-bold leading-snug text-white xs:text-[10px] sm:text-lg">
//             {account.title}
//           </h3>

//           <p className="shrink-0 text-gray-400 xs:text-[10px] sm:text-sm">
//             {formatDate(account.created_at)}
//           </p>
//         </div>

//         <div className="mt-auto flex items-center justify-between xs:gap-3 sm:mt-4 sm:gap-10 md:gap-15">
//           <div className="flex min-w-0 items-center gap-1 sm:gap-3">
//             {seller?.profile_image_url ? (
//               <img
//                 src={seller.profile_image_url}
//                 alt={`${seller.username} profile`}
//                 className="shrink-0 rounded-full border border-slate-700 object-cover xs:h-8 xs:w-8 sm:h-12 sm:w-12"
//               />
//             ) : (
//               <div className="shrink-0 rounded-full border border-slate-700 bg-slate-800 xs:h-8 xs:w-8 sm:h-12 sm:w-12" />
//             )}

//             <div className="min-w-0">
//               <p className="truncate text-sm font-bold text-white xs:text-[9px] sm:text-base">
//                 {seller?.username ?? "Seller"}
//               </p>
//               <p className="truncate font-medium text-slate-400 xs:text-[9px] sm:text-sm">
//                 Verified Seller
//               </p>
//             </div>
//           </div>

//           <p className="shrink-0 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent xs:text-[8px] sm:text-[15px] font-bold tracking-wider">
//             MMK {account.price}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default GameCard;