//  <Link
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