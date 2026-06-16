import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";

import { getListing, getListingImageUrl, type ListingDetails } from "@/lib/api";

const DEFAULT_TELEGRAM = "https://t.me/chillguy_phyothi";
const DEFAULT_MESSENGER = "MarnayGameStore";
const DEFAULT_VIBER = "+959425230471";

const getGameType = (gameName?: string | null) => {
  const normalizedGameName = gameName?.toLowerCase() ?? "";

  return normalizedGameName.includes("pubg") ? "pubg" : "mobile-legends";
};

const getGameLabel = (gameName?: string | null) => {
  if (!gameName) {
    return "Mobile Legends";
  }

  return gameName.toLowerCase().includes("pubg") ? "PUBG" : gameName;
};

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

  return saleType.toLowerCase() === "rental" ? "For rental" : "For sale";
};

const isString = (value: string | null): value is string => Boolean(value);

const buildTelegramUrl = (telegram?: string | null) => {
  // 1. Clean up the input string by trimming spaces
  const cleanedInput = telegram?.trim();

  // 2. If it's empty, use the default. Otherwise, use the input.
  const target = cleanedInput || DEFAULT_TELEGRAM;

  // 3. If the database mistakenly stored a full URL, strip it down to just the username
  const username = target.replace(/^https?:\/\/t\.me\//i, "").replace(/^@/, "");

  return `https://t.me/${username}`;
};

const buildMessengerUrl = (messenger?: string | null) => {
  const page = messenger || DEFAULT_MESSENGER;

  return /^https?:\/\//i.test(page) ? page : `https://m.me/${page}`;
};

const buildViberUrl = (phone?: string | null) => {
  const number = phone || DEFAULT_VIBER;

  return `viber://chat?number=${encodeURIComponent(number)}`;
};

const AccountDetailPage = () => {
  const { accountId } = useParams();
  const [account, setAccount] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDirection, setImageDirection] = useState<"next" | "previous">(
    "next",
  );

  useEffect(() => {
    if (!accountId) {
      setIsLoading(false);
      setError("Unable to load account.");
      return;
    }

    let isMounted = true;

    const loadAccount = async () => {
      try {
        setIsLoading(true);
        setError("");

        const listing = await getListing(accountId);

        if (!isMounted) {
          return;
        }

        setAccount(listing);
      } catch {
        if (!isMounted) {
          return;
        }

        setAccount(null);
        setError("Unable to load account.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [accountId]);

  const gameType = getGameType(account?.game);
  const gameLabel = getGameLabel(account?.game);

  const relatedImages = useMemo(() => {
    if (!account) {
      return [];
    }

    const mainImage = getListingImageUrl(account);
    const galleryImages = account.images
      .map((image) => image.image_url)
      .filter(isString);

    return Array.from(new Set([mainImage, ...galleryImages].filter(isString)));
  }, [account]);


  const hasScrollableThumbnails = relatedImages.length > 3;
  const seller = account?.seller;
  const selectedImage = relatedImages[selectedImageIndex];
  const hasMultipleImages = relatedImages.length > 1;

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [account?.id]);

  const showPreviousImage = () => {
    setImageDirection("previous");
    setSelectedImageIndex((currentIndex) =>
      currentIndex === 0 ? relatedImages.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setImageDirection("next");
    setSelectedImageIndex(
      (currentIndex) => (currentIndex + 1) % relatedImages.length,
    );
  };

  const showGalleryImage = (imageIndex: number) => {
    if (imageIndex === selectedImageIndex) {
      return;
    }

    setImageDirection(imageIndex > selectedImageIndex ? "next" : "previous");
    setSelectedImageIndex(imageIndex);
  };

  if (!accountId) {
    return <Navigate to="/see-more/mobile-legends" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-400">Loading account...</p>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/see-more/mobile-legends"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to accounts
        </Link>
        <p className="text-sm font-semibold text-red-400">
          {error || "Account not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/see-more/${gameType}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {gameLabel} accounts
      </Link>

      <section className="grid grid-cols-1 gap-6 rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 space-y-4">
          <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-black">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
              <img
                key={selectedImage}
                src={selectedImage}
                alt={account.title}
                className={`account-carousel-image account-carousel-image-${imageDirection} absolute inset-0 h-full w-full object-contain`}
              />
              <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2 py-1.5 text-xs font-bold text-emerald-300 sm:right-3 sm:top-3 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {formatSaleType(account.sale_type)}
              </span>
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/75 text-slate-200 transition-colors hover:bg-slate-900 hover:text-white sm:left-3 sm:h-11 sm:w-11"
                    aria-label="Previous account image"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/75 text-slate-200 transition-colors hover:bg-slate-900 hover:text-white sm:right-3 sm:h-11 sm:w-11"
                    aria-label="Next account image"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {hasMultipleImages && (
            <div
              className={`rounded-lg border border-slate-800 bg-slate-950/70 p-2 sm:p-3 ${
                hasScrollableThumbnails
                  ? "flex gap-2 overflow-x-auto sm:gap-3"
                  : `grid gap-2 sm:gap-3 ${
                      relatedImages.length === 2 ? "grid-cols-2" : "grid-cols-3"
                    }`
              }`}
            >
              {relatedImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => showGalleryImage(index)}
                  className={`aspect-[4/3] overflow-hidden rounded-lg border-2 bg-slate-900 transition-all ${
                    hasScrollableThumbnails
                      ? "w-[calc((100%-1rem)/3)] shrink-0 sm:w-[calc((100%-1.5rem)/3)]"
                      : "w-full min-w-0"
                  } ${
                    selectedImageIndex === index
                      ? "border-pink-400 shadow-[0_0_16px_rgba(244,114,182,0.28)]"
                      : "border-slate-800 opacity-70 hover:border-slate-500 hover:opacity-100"
                  }`}
                  aria-label={`Show account image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${account.title} related screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-lg border border-slate-800 bg-slate-950/35 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-purple-300">
              <Gamepad2 className="h-4 w-4" />
              {gameLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(account.created_at)}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <h1 className="break-words text-xl font-black tracking-wide text-white sm:text-2xl">
              {account.title}
            </h1>
            <p className="text-xs leading-7 text-slate-400 sm:text-sm">
              {account.description}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <BadgeDollarSign className="h-5 w-5 text-pink-400" />
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                Price
              </p>
              <p className="mt-1 text-lg lg:text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400">
                MMK {account.price}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                Status
              </p>
              <p className="mt-1 text-lg font-black text-white">
                Verified listing
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-3">
              {seller?.profile_image_url ? (
                <img
                  src={seller.profile_image_url}
                  alt={`${seller.username} profile`}
                  className="h-14 w-14 shrink-0 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-full border border-slate-700 bg-slate-800" />
              )}

              <div className="min-w-0">
                <p className="flex items-center gap-2 text-lg font-black text-white">
                  <UserRound className="h-4 w-4 text-slate-400" />
                  {seller?.username ?? "Seller"}
                </p>
                <p className="text-sm font-medium text-slate-400">
                  Verified Seller
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <a
              href={buildTelegramUrl(seller?.telegram)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-600"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
            <a
              href={buildMessengerUrl(seller?.messenger)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              Messenger
            </a>
            <a
              href={buildViberUrl(seller?.viber || seller?.phone)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex col-span-2 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Viber</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountDetailPage;