import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Gamepad2, ShieldCheck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import GameC from "@/components/game/GameC";
import { getGames, getListings,type Game,type Listing } from "@/lib/api";
import mobileLegendImage from "@/assets/images/mobilelegend.jpg";
import pubgImage from "@/assets/images/pubj.jpg";

type GameType = "mobile-legends" | "pubg";;

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
    description: "Browse ML accounts by skins, heroes, rank, and seller details.",
    image: mobileLegendImage,
    accent: "text-pink-400",
    gameNames: ["mobile legends", "mobile legend", "mlbb"],

  },
  pubg: {
    title: "PUBG Accounts",
    description: "Browse PUBG accounts by tier, outfits, UC, weapons, and inventory.",
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
    normalizedNames.includes(game.name.toLowerCase())
  );
};
const SeeMorePage = () => {
  const { gameType } = useParams();

  const safeGameType: GameType = isGameType(gameType)
    ? gameType
    : "mobile-legends";

  const page = seeMoreData[safeGameType];

  const [games, setGames] = useState<Game[]>([]);
  const [accounts, setAccounts] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedGame = useMemo(
    () => findGame(games, page.gameNames),
    [games, page.gameNames]
  );

  useEffect(() => {
    let isMounted = true;

    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const gamesData = await getGames();

        if (!isMounted) return;

        setGames(gamesData);

        const game = findGame(gamesData, page.gameNames);

        if (!game) {
          setAccounts([]);
          return;
        }

        const listingsData = await getListings({
          game_id: String(game.id),
        });

        if (!isMounted) return;

        setAccounts(listingsData);
      } catch {
        if (!isMounted) return;

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
  }, [page.gameNames]);

  if (!isGameType(gameType)) {
    return <Navigate to="/see-more/mobile-legends" replace />;
  }
  
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
          to="/see-more/mobile-legends"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            gameType === "mobile-legends"
              ? "bg-pink-500 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          }`}
        >
          Mobile Legends
        </Link>

        <Link
          to="/see-more/pubg"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            gameType === "pubg"
              ? "bg-pink-500 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          }`}
        >
          PUBG
        </Link>
      </div>

      {error && <p className="text-sm font-semibold text-red-400">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading accounts...</p>
      ) : accounts.length ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <GameC key={account.id} account={account} />
          ))}
        </section>
      ) : (
        <p className="text-sm text-slate-400">
          No accounts found{selectedGame ? "." : " for this game."}
        </p>
      )}
    </div>
  );
};

export default SeeMorePage;