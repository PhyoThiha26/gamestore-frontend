import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  //CircleCheckBig,
  Gamepad2,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link, Navigate, useParams, useSearchParams } from "react-router";

import GameCard from "@/components/game/GameCard";
import { getGames, getListings, type Game, type Listing } from "@/lib/api";
import mobileLegendImage from "@/assets/images/mobilelegend.jpg";
import pubgImage from "@/assets/images/pubj.jpg";

type GameType = "mobile-legends" | "pubg";
type PriceSort = "newest" | "price_asc" | "price_desc";

const seeMoreData: Record<
  GameType,
  {
    title: string;
    description: string;
    image: string;
    accent: string;
    gameNames: string[];
  }
> = {
  "mobile-legends": {
    title: "Mobile Legends Accounts",
    description:
      "Browse ML accounts by skins, heroes, rank, and seller details.",
    image: mobileLegendImage,
    accent: "text-pink-400",
    gameNames: ["mobile legends", "mobile legend", "mlbb"],
  },
  pubg: {
    title: "PUBG Accounts",
    description:
      "Browse PUBG accounts by tier, outfits, UC, weapons, and inventory.",
    image: pubgImage,
    accent: "text-emerald-400",
    gameNames: ["pubg", "pubg mobile"],
  },
};

const isGameType = (value: string | undefined): value is GameType =>
  value === "mobile-legends" || value === "pubg";

const findGame = (games: Game[], names: string[]) => {
  const normalizedNames = names.map((name) => name.toLowerCase());

  return games.find((game) =>
    normalizedNames.includes(game.name.toLowerCase()),
  );
};

// const smallScreenAccountsPerPage = 6;
// const largeScreenAccountsPerPage = 6;

const SeeMorePage = () => {
  const { gameType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const safeGameType: GameType = isGameType(gameType)
    ? gameType
    : "mobile-legends";
  const page = seeMoreData[safeGameType];

  const [games, setGames] = useState<Game[]>([]);
  const [accounts, setAccounts] = useState<Listing[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // const [accountsPerPage, setAccountsPerPage] = useState(
  //   smallScreenAccountsPerPage,
  // );

  const search = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") || "newest") as PriceSort;
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const requestedPage = Number(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);


  const selectedGame = useMemo(
    () => findGame(games, page.gameNames),
    [games, page.gameNames],
  );

  useEffect(() => {
    setSearchInput(search);
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
  }, [search, minPrice, maxPrice]);

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(min-width: 1024px)");
  //   const updateAccountsPerPage = () => {
  //     setAccountsPerPage(
  //       mediaQuery.matches
  //         ? largeScreenAccountsPerPage
  //         : smallScreenAccountsPerPage,
  //     );
  //   };

  //   updateAccountsPerPage();
  //   mediaQuery.addEventListener("change", updateAccountsPerPage);

  //   return () => {
  //     mediaQuery.removeEventListener("change", updateAccountsPerPage);
  //   };
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const gamesData = await getGames();

        if (!isMounted) {
          return;
        }

        setGames(gamesData);

        const game = findGame(gamesData, page.gameNames);

        if (!game) {
          setAccounts([]);
          return;
        }

        const listingsData = await getListings({
          game_id: String(game.id),
          search,
          sort,
          min_price: minPrice,
          max_price: maxPrice,
          page: String(requestedPage),
          per_page: "12",
        });

        if (!isMounted) {
          return;
        }

        setAccounts(listingsData.items);
        setTotalPages(listingsData.pages);
        setTotalItems(listingsData.total);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Unable to load accounts.");
        setAccounts([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAccounts();

    return () => {
      isMounted = false;
    };
  },  [page.gameNames, search, sort, minPrice, maxPrice]);

  if (!isGameType(gameType)) {
    return <Navigate to="/see-more/mobile-legends" replace />;
  }

  // const totalPages = Math.max(1, Math.ceil(accounts.length / accountsPerPage));
  // const currentPage = Number.isInteger(requestedPage)
  //   ? Math.min(Math.max(requestedPage, 1), totalPages)
  //   : 1;
  // const firstAccountIndex = (currentPage - 1) * accountsPerPage;
  // const paginatedAccounts = accounts.slice(
  //   firstAccountIndex,
  //   firstAccountIndex + accountsPerPage,
  // );

   const currentPage = requestedPage;

   const updateFilters = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    setSearchParams(params);
  };

  const getPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));

    return `/see-more/${safeGameType}?${params.toString()}`;
  };

  const applyFilters = () => {
    updateFilters({
      search: searchInput,
      min_price: minPriceInput,
      max_price: maxPriceInput,
    });
  };

  const resetFilters = () => {
    setSearchParams({ page: "1" });
  };

  const hasActiveFilters =
    search !== "" || sort !== "newest" || minPrice !== "" || maxPrice !== "";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr]">
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10">
                <Gamepad2 className={`h-6 w-6 ${page.accent}`} />
              </div>
              <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                See More
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-wide text-white sm:text-4xl">
                {page.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {page.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified sellers
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <Gamepad2 className="h-4 w-4 text-purple-400" />
                {isLoading ? "Loading..." : `${accounts.length} accounts`}
              </span>
            </div>
          </div>

          <div className="relative min-h-56 bg-slate-950 lg:min-h-full">
            <img
              src={page.image}
              alt={page.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/see-more/mobile-legends?page=1"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            gameType === "mobile-legends"
              ? "bg-pink-500 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          }`}
        >
          Mobile Legends
        </Link>
        <Link
          to="/see-more/pubg?page=1"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            gameType === "pubg"
              ? "bg-pink-500 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          }`}
        >
          PUBG
        </Link>
      </div>

      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-300">
              <SlidersHorizontal className="h-4 w-4 text-pink-400" />
              Filters
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Showing {totalItems} account{totalItems === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[180px_150px_150px_auto]">
            <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Sort price
              <div className="relative mt-2">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={sort}
                  onChange={(event) =>
                    updateFilters({ sort: event.target.value })
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-10 text-sm font-semibold text-white outline-none transition-colors focus:border-pink-500"
                >
                  <option value="newest">Default</option>
                  <option value="price_asc">Low to high</option>
                  <option value="price_desc">High to low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </label>

            <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Min price
              <input
                type="number"
                inputMode="numeric"
                min={0}
               // placeholder={formatPrice(lowestPrice)}
                value={minPriceInput}
                onChange={(event) => setMinPriceInput(event.target.value)}
                className="h-11 mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-pink-500"
              />
            </label>

            <label className="space-y-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Max price
              <input
                type="number"
                inputMode="numeric"
                min={0}
                //placeholder={formatPrice(highestPrice)}
                value={maxPriceInput}
                onChange={(event) => setMaxPriceInput(event.target.value)}
                className="h-11 mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-pink-500"
              />
            </label>

            <button
              type="button"
              onClick={applyFilters}
              className="mt-auto inline-flex h-11 items-center justify-center rounded-lg bg-pink-500 px-4 text-sm font-bold text-white transition-colors hover:bg-pink-600"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 text-sm font-bold text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </section>

      {error && <p className="text-sm font-semibold text-red-400">{error}</p>}



      {isLoading ? (
        <p className="text-sm text-slate-400">Loading accounts...</p>
      ) : accounts.length > 0 ? (
        <section className="grid grid-cols-2 gap-1.5 md:gap-5       lg:grid-cols-3">
          {accounts.map((account) => (
            <GameCard key={account.id} account={account} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
          <p className="text-lg font-black text-white">No accounts found</p>
          <p className="mt-2 text-sm text-slate-400">
            {selectedGame
              ? "Try a different search or price range."
              : "No backend game matched this page."}
          </p>
        </section>
      )}

      {totalPages > 1 && (
        <nav
          className="flex flex-col items-center justify-between gap-4 rounded-lg md:border md:border-slate-800 md:bg-slate-900/50 p-4 sm:flex-row"
          aria-label="Account pagination"
        >
          <p className="text-sm font-medium text-slate-400">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link
                to={getPageLink(currentPage - 1)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-600">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Link
                  key={pageNumber}
                  to={getPageLink(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black transition-colors ${
                    currentPage === pageNumber
                      ? "bg-pink-500 text-white"
                      : "border border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                to={getPageLink(currentPage + 1)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-600">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default SeeMorePage;