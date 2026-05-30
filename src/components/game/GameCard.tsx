import React from "react";
import type { Game } from "@/lib/gamesData";
import { useStore } from "@/context/StoreContext";
import { Star, Heart, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameCardProps {
  game: Game;
  onViewDetails: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onViewDetails }) => {
  const {
    cart,
    wishlist,
    library,
    addToCart,
    toggleWishlist,
  } = useStore();

  const isWishlisted = wishlist.includes(game.id);
  const isAddedToCart = cart.includes(game.id);
  const isPurchased = library.includes(game.id);

  const basePrice = game.price;
  const hasDiscount = game.discount > 0;
  const activePrice = hasDiscount ? basePrice * (1 - game.discount / 100) : basePrice;

  // Platform icon helper
  const renderPlatformIcons = (platforms: typeof game.platforms) => {
    return (
      <div className="flex gap-1.5 text-slate-500">
        {platforms.includes("PC") && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/5" title="PC">PC</span>
        )}
        {platforms.includes("PS5") && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/5" title="PlayStation 5">PS5</span>
        )}
        {platforms.includes("Xbox") && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/5" title="Xbox Series X/S">XBOX</span>
        )}
        {platforms.includes("Switch") && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/5" title="Nintendo Switch">NSW</span>
        )}
      </div>
    );
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* Cover Image & Quick Action Indicators */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-800 flex-shrink-0">
        <img
          src={game.coverImage}
          alt={game.title}
          onClick={onViewDetails}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
        />

        {/* Backdrop overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(game.id)}
          className={`absolute top-3 right-3 p-2 rounded-xl border backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isWishlisted
              ? "bg-rose-500/20 border-rose-500 text-rose-500"
              : "bg-black/40 border-white/10 text-slate-400 hover:text-rose-500 hover:border-rose-500/50"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20">
            -{game.discount}%
          </div>
        )}

        {/* Hover View Detail Quick Trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={onViewDetails}
            className="bg-white/15 hover:bg-white/25 text-white backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 cursor-pointer shadow-md font-semibold"
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Game Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            {renderPlatformIcons(game.platforms)}
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{game.rating}</span>
            </div>
          </div>

          <h3
            onClick={onViewDetails}
            className="font-bold text-white text-base leading-tight tracking-wide line-clamp-1 hover:text-purple-400 transition-colors cursor-pointer"
          >
            {game.title}
          </h3>

          <p className="text-xs text-slate-500 truncate">{game.developer}</p>
        </div>

        {/* Footer Actions / Price */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/50">
          <div className="flex flex-col">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-base">
              {activePrice === 0 ? "Free" : `$${activePrice.toFixed(2)}`}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-500 line-through">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Cart Status Button */}
          {isPurchased ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              <span>OWNED</span>
            </div>
          ) : isAddedToCart ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Check className="w-3.5 h-3.5" />
              <span>IN CART</span>
            </div>
          ) : (
            <button
              onClick={() => addToCart(game.id)}
              className="p-2 rounded-xl bg-purple-600/10 hover:bg-purple-600 border border-purple-500/20 hover:border-purple-500 text-purple-400 hover:text-white transition-all cursor-pointer shadow-md hover:shadow-purple-500/20"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
