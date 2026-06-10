// import {
//   ArrowLeft,
//   ArrowUpDown,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   CircleCheckBig,
//   Gamepad2,
//   ShieldCheck,
//   SlidersHorizontal,
//   X,
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { Link, Navigate, useParams, useSearchParams } from "react-router";

// import denoeProfileImage from "@/assets/images/denoe-profile.jpg";
// import { gamesAccounts, type GameAccount } from "@/lib/gamesAccounts";
// import mobileLegendImage from "@/assets/images/mobilelegend.jpg";
// import pubgImage from "@/assets/images/pubj.jpg";

// type GameType = GameAccount["gameType"];
// type PriceSort = "default" | "low-to-high" | "high-to-low";

// const seeMoreData: Record<
//   GameType,
//   {
//     title: string;
//     description: string;
//     image: string;
//     accent: string;
//   }
// > = {
//   "mobile-legends": {
//     title: "Mobile Legends Accounts",
//     description:
//       "Browse ML accounts by skins, heroes, rank, and seller details.",
//     image: mobileLegendImage,
//     accent: "text-pink-400",
//   },
//   pubg: {
//     title: "PUBG Accounts",
//     description:
//       "Browse PUBG accounts by tier, outfits, UC, weapons, and inventory.",
//     image: pubgImage,
//     accent: "text-emerald-400",
//   },
// };

// const isGameType = (value: string | undefined): value is GameType =>
//   value === "mobile-legends" || value === "pubg";

// const smallScreenAccountsPerPage = 4;
// const largeScreenAccountsPerPage = 6;

// const getAccountPrice = (price: string) => Number(price.replace(/,/g, ""));
// const formatPrice = (price: number) => price.toLocaleString("en-US");

// const SeeMorePage = () => {
//   const { gameType } = useParams();
//   const [searchParams] = useSearchParams();
//   const activeGameType: GameType = isGameType(gameType)
//     ? gameType
//     : "mobile-legends";
//   const [accountsPerPage, setAccountsPerPage] = useState(
//     smallScreenAccountsPerPage,
//   );
//   const [priceSort, setPriceSort] = useState<PriceSort>("default");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const accounts = useMemo(
//     () =>
//       gamesAccounts.filter(
//         (account) => account.gameType === activeGameType,
//       ),
//     [activeGameType],
//   );

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(min-width: 1024px)");
//     const updateAccountsPerPage = () => {
//       setAccountsPerPage(
//         mediaQuery.matches
//           ? largeScreenAccountsPerPage
//           : smallScreenAccountsPerPage,
//       );
//     };

//     updateAccountsPerPage();
//     mediaQuery.addEventListener("change", updateAccountsPerPage);

//     return () => {
//       mediaQuery.removeEventListener("change", updateAccountsPerPage);
//     };
//   }, []);

//   const accountPrices = accounts.map((account) =>
//     getAccountPrice(account.price),
//   );
//   const lowestPrice = Math.min(...accountPrices);
//   const highestPrice = Math.max(...accountPrices);
//   const minPriceValue = minPrice === "" ? undefined : Number(minPrice);
//   const maxPriceValue = maxPrice === "" ? undefined : Number(maxPrice);
//   const filteredAccounts = useMemo(() => {
//     const nextAccounts = accounts.filter((account) => {
//       const price = getAccountPrice(account.price);
//       const matchesMin =
//         minPriceValue === undefined || Number.isNaN(minPriceValue)
//           ? true
//           : price >= minPriceValue;
//       const matchesMax =
//         maxPriceValue === undefined || Number.isNaN(maxPriceValue)
//           ? true
//           : price <= maxPriceValue;

//       return matchesMin && matchesMax;
//     });

//     if (priceSort === "low-to-high") {
//       return [...nextAccounts].sort(
//         (firstAccount, secondAccount) =>
//           getAccountPrice(firstAccount.price) - getAccountPrice(secondAccount.price),
//       );
//     }

//     if (priceSort === "high-to-low") {
//       return [...nextAccounts].sort(
//         (firstAccount, secondAccount) =>
//           getAccountPrice(secondAccount.price) - getAccountPrice(firstAccount.price),
//       );
//     }

//     return nextAccounts;
//   }, [accounts, maxPriceValue, minPriceValue, priceSort]);
//   const hasActiveFilters =
//     priceSort !== "default" || minPrice !== "" || maxPrice !== "";
//   const requestedPage = Number(searchParams.get("page") || "1");
//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredAccounts.length / accountsPerPage),
//   );
//   const currentPage = Number.isInteger(requestedPage)
//     ? Math.min(Math.max(requestedPage, 1), totalPages)
//     : 1;
//   const firstAccountIndex = (currentPage - 1) * accountsPerPage;
//   const paginatedAccounts = filteredAccounts.slice(
//     firstAccountIndex,
//     firstAccountIndex + accountsPerPage,
//   );
//   const getPageLink = (pageNumber: number) =>
//     `/see-more/${activeGameType}?page=${pageNumber}`;
//   const resetFilters = () => {
//     setPriceSort("default");
//     setMinPrice("");
//     setMaxPrice("");
//   };

//   if (!isGameType(gameType)) {
//     return <Navigate to="/see-more/mobile-legends" replace />;
//   }

//   const page = seeMoreData[activeGameType];

//   return (
//     <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
//       <Link
//         to="/"
//         className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to home
//       </Link>

//       <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50">
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr]">
//           <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10">
//                 <Gamepad2 className={`h-6 w-6 ${page.accent}`} />
//               </div>
//               <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-300">
//                 See More
//               </span>
//             </div>

//             <div>
//               <h1 className="text-3xl font-black tracking-wide text-white sm:text-4xl">
//                 {page.title}
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//                 {page.description}
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-3 text-xs text-slate-300">
//               <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
//                 <ShieldCheck className="h-4 w-4 text-emerald-400" />
//                 Verified sellers
//               </span>
//               <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
//                 <Gamepad2 className="h-4 w-4 text-purple-400" />
//                 {accounts.length} accounts
//               </span>
//             </div>
//           </div>

//           <div className="relative min-h-56 bg-slate-950 lg:min-h-full">
//             <img
//               src={page.image}
//               alt={page.title}
//               className="absolute inset-0 h-full w-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r" />
//           </div>
//         </div>
//       </section>

//       <div className="flex flex-wrap gap-3">
//         <Link
//           to="/see-more/mobile-legends?page=1"
//           className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
//             gameType === "mobile-legends"
//               ? "bg-pink-500 text-white"
//               : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
//           }`}
//         >
//           Mobile Legends
//         </Link>
//         <Link
//           to="/see-more/pubg?page=1"
//           className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
//             gameType === "pubg"
//               ? "bg-pink-500 text-white"
//               : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
//           }`}
//         >
//           PUBG
//         </Link>
//       </div>

//       <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
//         <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//           <div>
//             <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-300">
//               <SlidersHorizontal className="h-4 w-4 text-pink-400" />
//               Filters
//             </div>
//             <p className="mt-1 text-sm text-slate-500">
//               Showing {filteredAccounts.length} of {accounts.length} accounts
//             </p>
//           </div>

//           <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[180px_150px_150px_auto]">
//             <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
//               Sort price
//               <div className="relative mt-2">
//                 <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                 <select
//                   value={priceSort}
//                   onChange={(event) =>
//                     setPriceSort(event.target.value as PriceSort)
//                   }
//                   className="h-11 w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-10 text-sm font-semibold text-white outline-none transition-colors focus:border-pink-500"
//                 >
//                   <option value="default">Default</option>
//                   <option value="low-to-high">Low to high</option>
//                   <option value="high-to-low">High to low</option>
//                 </select>
//                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
//               </div>
//             </label>

//             <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
//               Min price
//               <input
//                 type="number"
//                 inputMode="numeric"
//                 min={0}
//                 placeholder={formatPrice(lowestPrice)}
//                 value={minPrice}
//                 onChange={(event) => setMinPrice(event.target.value)}
//                 className="h-11 mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-pink-500"
//               />
//             </label>

//             <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
//               Max price
//               <input
//                 type="number"
//                 inputMode="numeric"
//                 min={0}
//                 placeholder={formatPrice(highestPrice)}
//                 value={maxPrice}
//                 onChange={(event) => setMaxPrice(event.target.value)}
//                 className="h-11 mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-pink-500"
//               />
//             </label>

//             <button
//               type="button"
//               onClick={resetFilters}
//               disabled={!hasActiveFilters}
//               className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 text-sm font-bold text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
//             >
//               <X className="h-4 w-4" />
//               Reset
//             </button>
//           </div>
//         </div>
//       </section>

//       {paginatedAccounts.length > 0 ? (
//         <section className="grid gap-1.5  md:gap-5 grid-cols-2 lg:grid-cols-3">
//           {paginatedAccounts.map((account) => (
//             <Link
//               key={account.id}
//               to={`/accounts/${account.id}`}
//               // className="block w-full min-w-0 overflow-hidden rounded-lg shadow-md hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]  transition-all duration-300"
//               className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-800/80 shadow-md transition-all duration-300 hover:border-purple-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
//             >
//               <div className="relative shrink-0 group">
//                 <img
//                   src={account.image}
//                   alt="Game Cover"
//                   // className="w-full h-40 sm:h-60 xs:h-35 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
//                   className="h-40 sm:h-60 xs:h-35 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 {/* <p className="text-sm text-green-500 rounded-sm py-0.5 px-1 bg-green-600/20 mt-1 flex items-center gap-1 absolute top-2 right-2"> */}
//                 <p className="absolute right-2 top-2 flex items-center gap-1 rounded-sm bg-green-600/20 px-1 py-0.5 text-sm text-green-500">
//                   <CircleCheckBig className="w-4 h-4" /> For rental
//                 </p>
//               </div>

//               <div className="flex flex-1 flex-col p-4">
//                 {/* <div className="flex items-center justify-between gap-2 border-b border-b-mauve-500 pb-2"> */}
//                 <div className="flex items-start justify-between gap-2 border-b border-b-mauve-500 pb-2">
//                   <h3 className="sm:text-lg xs:text-[10px] line-clamp-2 min-w-0 flex-1 font-bold leading-snug text-white">
//                     {account.name}
//                   </h3>
//                   <p className="sm:text-sm xs:text-[10px] shrink-0 text-gray-400">
//                     {account.date}
//                   </p>
//                 </div>

//                 <div className=" mt-auto flex items-center justify-between gap-3 pt-4 md:gap-10  sm:gap-5 xs:gap-3">
//                   <div className=" flex min-w-0 items-center gap-1 sm:gap-3">
//                     <img
//                       src={denoeProfileImage}
//                       alt="Denoe profile"
//                       className="sm:h-12 sm:w-12 xs:h-8 xs:w-8 shrink-0 rounded-full border border-slate-700 object-cover"
//                     />
//                     <div className="min-w-0">
//                       <p className="truncate sm:text-base xs:text-[9px] text-sm font-bold text-white">
//                         Denoe
//                       </p>
//                       <p className="truncate sm:text-sm xs:text-[9px]  text-sm font-medium text-slate-400">
//                         Verified Seller
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <p className="sm:text-[15px] xs:text-[8px] shrink-0 text-base font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400">
//                       MMK {account.price}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </section>
//       ) : (
//         <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
//           <p className="text-lg font-black text-white">No accounts found</p>
//           <p className="mt-2 text-sm text-slate-400">
//             Try a different price range or reset the filters.
//           </p>
//         </section>
//       )}

//       {totalPages > 1 && (
//         <nav
//           className="flex flex-col items-center justify-between gap-4 rounded-lg md:border md:border-slate-800 md:bg-slate-900/50 p-4 sm:flex-row"
//           aria-label="Account pagination"
//         >
//           <p className="text-sm font-medium text-slate-400">
//             Page {currentPage} of {totalPages}
//           </p>

//           <div className="flex flex-wrap items-center justify-center gap-2">
//             {currentPage > 1 ? (
//               <Link
//                 to={getPageLink(currentPage - 1)}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:text-white"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </Link>
//             ) : (
//               <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-600">
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </span>
//             )}

//             {Array.from({ length: totalPages }, (_, index) => {
//               const pageNumber = index + 1;
//               return (
//                 <Link
//                   key={pageNumber}
//                   to={getPageLink(pageNumber)}
//                   aria-current={currentPage === pageNumber ? "page" : undefined}
//                   className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black transition-colors ${
//                     currentPage === pageNumber
//                       ? "bg-pink-500 text-white"
//                       : "border border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
//                   }`}
//                 >
//                   {pageNumber}
//                 </Link>
//               );
//             })}

//             {currentPage < totalPages ? (
//               <Link
//                 to={getPageLink(currentPage + 1)}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:text-white"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Link>
//             ) : (
//               <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-600">
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </span>
//             )}
//           </div>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default SeeMorePage;