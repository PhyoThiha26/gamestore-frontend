import React, { useEffect, useState } from "react";
// import { useStore } from "@/context/StoreContext";
// import type { Game } from "@/lib/gamesData";

// import GameDetailsModal from "@/components/game/GameDetailsModal";
import { ArrowRight, BadgeDollarSign, Gamepad2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopularGameCard from "@/components/game/PopularGameCard";
import GameC from "@/components/game/GameC";
import { Link } from "react-router";
import { getHomeData, type HomeData } from "@/lib/api";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import mobileLegendImage from "@/assets/images/mobilelegend.jpg";
import pubgImage from "@/assets/images/pubj.jpg";
import heroOneImage from "@/assets/images/Hero_1.png";
import heroTwoImage from "@/assets/images/Hero_2.png";



const App: React.FC = () => {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sellerLinks = [
    {
      title: "Mobile Legend",
      description: "List ML accounts with skins, rank, heroes, diamonds, and verified contact details.",
      image: mobileLegendImage,
      to: "/sell/mobile-legends",
    },
    {
      title: "PUBG",
      description: "Sell PUBG accounts with outfits, UC history, tier, weapons, and inventory highlights.",
      image: pubgImage,
      to: "/sell/pubg",
    },
  ];

  const heroSlides = [
    {
      image: heroOneImage,
      title: "Buy Game Accounts",
      description: "Browse verified Mobile Legends and PUBG accounts with clear pricing and account details.",
    },
    {
      image: heroTwoImage,
      title: "Sell Your Account",
      description: "List your account with rank, skins, inventory highlights, and trusted contact information.",
    },
  ];

  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [homeError, setHomeError] = useState("");
  const activeHeroSlide = heroSlides[heroIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    getHomeData()
      .then(setHomeData)
      .catch(() => setHomeError("Unable to load store data."));
  }, []);

  const games = homeData?.games ?? [];
  const mobileLegendsListings = homeData?.mobile_legends_listings ?? [];
  const pubgListings = homeData?.pubg_listings ?? [];

  

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden text-slate-100 pb-20 space-y-12">
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="relative min-h-[360px] sm:min-h-[500px]">
          <img
            src={activeHeroSlide.image}
            alt={activeHeroSlide.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />

          <div className="relative z-10 flex min-h-[360px] w-full max-w-7xl flex-col justify-center px-5 py-14 sm:min-h-[500px] sm:px-8 lg:px-12">
            <div className="min-w-0 max-w-xl space-y-5">
              <h1 className="max-w-full break-words text-2xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl">
                {activeHeroSlide.title}
              </h1>
              <p className="max-w-full text-sm leading-6 text-slate-300 sm:max-w-lg sm:text-base">
                {activeHeroSlide.description}
              </p>
              <div className="flex max-w-full md:w-full w-[50%] flex-col items-stretch gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  onClick={() => scrollToSection("sell-your-account")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-pink-600 px-5 py-3 font-bold text-white shadow-lg shadow-pink-950/30 transition-colors hover:bg-pink-500 sm:justify-start"
                >
                  <BadgeDollarSign className="h-5 w-5" />
                  <span>Account ရောင်းရန်</span>
                </Button>
                <Button
                  onClick={() => scrollToSection("mobile-legends")}
                  className="cursor-pointer rounded-lg border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition-colors hover:bg-white/15"
                >
                  Account ဝယ်ရန်
                </Button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setHeroIndex((currentIndex) =>
                currentIndex === 0 ? heroSlides.length - 1 : currentIndex - 1,
              )
            }
            className="absolute hidden left-4 top-1/2 z-20 sm:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/60 text-2xl text-white transition-colors hover:bg-slate-900"
            aria-label="Previous hero slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() =>
              setHeroIndex(
                (currentIndex) => (currentIndex + 1) % heroSlides.length,
              )
            }
            className="absolute hidden right-4 top-1/2 z-20 sm:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/60 text-2xl text-white transition-colors hover:bg-slate-900"
            aria-label="Next hero slide"
          >
            ›
          </button>
        </div>
      </section>

      {/* 2. Core Catalog & Browsing Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* For Popular Games */}
        <div className="">
          <h2 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            <span>Popular Games</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {games.length} games matching your criteria
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {homeError ? (
              <p className="text-sm text-rose-400">{homeError}</p>
            ) : (
              <PopularGameCard games={games} />
            )}
          </div>
        </div>

        {/* ML Account Show */}
        <div className="sm:mt-25 mt-5" id="mobile-legends">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              <span>Mobile Legends Accounts</span>
            </h2>
            <div className="hidden sm:block">
              <Link
                to="/see-more/mobile-legends"
                className="px-3 w-full text-center  py-2 text-white bg-pink-500 rounded-lg text-md font-medium hover:bg-pink-600 transition-colors"
              >
                See More
              </Link>
            </div>
          </div>
          <div className="mt-6 block">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="items-stretch">
                {mobileLegendsListings.map((account, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full p-1">
                      <GameC account={account} />
                    </div>
                  </CarouselItem>
                ))}
                {/* See More Card */}
                <CarouselItem className=" md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Link
                      to="/see-more/mobile-legends"
                      className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-purple-500/40 bg-slate-900/50 transition-all duration-300 hover:bg-slate-900 cursor-pointer group sm:min-h-[360px]"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-3xl text-purple-400">+</span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-white">
                        See More
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Explore more accounts
                      </p>
                    </Link>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400" />
            </Carousel>
          </div>
          <Link
            to="/see-more/mobile-legends"
            className="mt-6 sm:hidden block ml-auto w-max bg-pink-500 text-white px-4 py-2 rounded-lg text-md font-medium hover:bg-pink-600 transition-colors"
          >
            See More Accounts{" "}
            <ArrowRight className="w-4 h-4 inline-block ml-1" />
          </Link>
        </div>

        {/* PUBG ACCOUNTs */}
        <div className="mt-20" id="pubg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              <span>PUBG Accounts</span>
            </h2>
            <div className="hidden sm:block">
              <Link
                to="/see-more/pubg"
                className="px-3 w-full text-center  py-2 text-white bg-pink-500 rounded-lg text-md font-medium hover:bg-pink-600 transition-colors"
              >
                See More
              </Link>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:hidden gap-5 mt-6">
            {gamesAccounts.map((account, index) => (
              <GameC key={index} account={account} />
            ))}
          </div> */}
          <div className="mt-6 block">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="items-stretch">
                {pubgListings.map((account, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full p-1">
                      <GameC account={account} />
                    </div>
                  </CarouselItem>
                ))}
                {/* See More Card */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Link
                      to="/see-more/pubg"
                      className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-purple-500/40 bg-slate-900/50 transition-all duration-300 hover:bg-slate-900 cursor-pointer group sm:min-h-[360px]"
                    >
                      <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-3xl text-purple-400">+</span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-white">
                        See More
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Explore more accounts
                      </p>
                    </Link>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400" />
            </Carousel>
          </div>
          <Link
            to="/see-more/pubg"
            className="mt-6 sm:hidden block ml-auto w-max bg-pink-500 text-white px-4 py-2 rounded-lg text-md font-medium hover:bg-pink-600 transition-colors"
          >
            See More Accounts{" "}
            <ArrowRight className="w-4 h-4 inline-block ml-1" />
          </Link>
        </div>
      </section>

      {/* 3. Sell Your Accounts */}
      <section
        id="sell-your-account"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-5">
              <div className="w-12 h-12 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <BadgeDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-pink-400">
                  Seller Center
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-wide text-white">
                  Sell Your Account
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400 max-w-xl">
                  {/* Create a listing request for your game account and prepare the key details buyers need to review before contacting you. */}
                  Mobile Legends/PUBG အကောင့်များကို ဈေးနှုန်းမှန်ကန်
                  ယုံကြည်စိတ်ချစွာဖြင့် Marnay Storeတွင် အရောင်းအဝယ်၊အလဲအထပ်
                  ပြုလုပ်လိုက်ပါ။
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified listing review
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  ML and PUBG supported
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-slate-950/40">
              {sellerLinks.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group rounded-lg border border-slate-800 bg-slate-900 overflow-hidden hover:border-pink-500/50 hover:shadow-[0_0_24px_rgba(236,72,153,0.14)] transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-800">
                    <img
                      src={item.image}
                      alt={`${item.title} seller account`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                    <span className="absolute left-4 bottom-4 text-lg font-black text-white">
                      {item.title}
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-pink-400">
                      <span>Open seller account link</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Game Detail Overlay Modal */}
      {/* {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )} */}
    </div>
  );
};

export default App;