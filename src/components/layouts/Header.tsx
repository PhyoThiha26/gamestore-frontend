import React from "react";
import { Link, useLocation } from "react-router";
import { useStore } from "@/context/StoreContext";
import { Gamepad2, Moon, Search, ShoppingCart, Sun } from "lucide-react";
// import {
//   ShoppingCart,
//   Heart,
//   Library,
//   Gamepad2,
//   Sun,
//   Moon,
//   Search,
// } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  //   const {
  //     cart,
  //     wishlist,
  //     theme,
  //     toggleTheme,
  //     setCartOpen,
  //     searchQuery,
  //     setSearchQuery,
  //   } = useStore();

  const { theme, toggleTheme, cart, setCartOpen, searchQuery, setSearchQuery } =
    useStore();

  const isStorePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
            <Gamepad2 className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400">
            MARNAY
          </span>
        </Link>

        <div className="sm:hidden flex items-center gap-2 shrink-0">
          {/* Theme Toggler */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleTheme();
            }}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-400" />
            )}
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex size-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-600/10 hover:bg-purple-600/25 text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
            title="Open Cart"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-between gap-6 min-w-md">
          {/* Search Bar - only show/functional on store list, otherwise just search placeholder */}
          <div className="flex-1 min-w-sm hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={
                isStorePage
                  ? "Search games, genres, publishers..."
                  : "Search games..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>

          {/* Signin or Signup Button */}
          <div className="flex-1 min-w-25 hidden sm:block relative ">
            <Link
              to="/signup"
              className="px-3 w-full text-center  py-2 text-white bg-pink-500 rounded-lg text-md font-medium absolute ight-4 top-1/2 -translate-y-1/2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 sm:hidden block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
