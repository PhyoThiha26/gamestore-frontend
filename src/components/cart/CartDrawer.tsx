import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Gift } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const CartDrawer: React.FC = () => {
  const {
    cart,
    games,
    removeFromCart,
    cartOpen,
    setCartOpen,
  } = useStore();
  
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const cartGames = games.filter((game) => cart.includes(game.id));

  // Calculations
  const rawSubtotal = cartGames.reduce((sum, game) => {
    const activePrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price;
    return sum + activePrice;
  }, 0);

  const discountAmount = rawSubtotal * (discountPercent / 100);
  const total = rawSubtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "MARNAY20") {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === "CYBERFREE") {
      setDiscountPercent(100);
      setPromoApplied(true);
    } else if (promoCode.trim()) {
      setPromoError("Invalid code. Try 'MARNAY20'");
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    // Navigate to checkout and pass the applied discount percent via state
    navigate("/checkout", { state: { discountPercent } });
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full bg-slate-900/95 dark:bg-zinc-950/95 border-l border-white/10 flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Shopping Cart ({cartGames.length})
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {cartGames.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-300">Your cart is empty</p>
                <p className="text-sm text-slate-500 mt-1">Explore the store to add amazing games!</p>
              </div>
              <Button
                onClick={() => setCartOpen(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 cursor-pointer"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            cartGames.map((game) => {
              const basePrice = game.price;
              const hasDiscount = game.discount > 0;
              const activePrice = hasDiscount ? basePrice * (1 - game.discount / 100) : basePrice;

              return (
                <div
                  key={game.id}
                  className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all duration-200"
                >
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-16 h-20 object-cover rounded-lg bg-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-white hover:text-purple-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">{game.developer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium text-purple-300 text-sm">
                        ${activePrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-xs line-through text-slate-500">
                            ${basePrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                            -{game.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(game.id)}
                    className="self-start p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Billing Detail */}
        {cartGames.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Promo Code (MARNAY20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={promoApplied || !promoCode}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600/80 hover:bg-purple-600 disabled:bg-white/5 text-white transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoApplied && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                <Gift className="w-4 h-4 flex-shrink-0" />
                <span>Promo applied! You saved {discountPercent}% on your purchase.</span>
              </div>
            )}

            {promoError && (
              <p className="text-xs text-rose-400 px-1">{promoError}</p>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-sm text-emerald-400 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/35"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
