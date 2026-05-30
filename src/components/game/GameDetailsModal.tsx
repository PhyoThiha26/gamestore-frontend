import React, { useState } from "react";
import { CPU_LIST, GPU_LIST, RAM_LIST } from "@/lib/gamesData";
import type { Game } from "@/lib/gamesData";
import { useStore } from "@/context/StoreContext";
import { X, Star, ShoppingCart, Check, ShieldCheck, Heart, User, Send, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameDetailsModalProps {
  game: Game;
  onClose: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ game, onClose }) => {
  const {
    cart,
    wishlist,
    library,
    addToCart,
    toggleWishlist,
    addReview,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
  const [selectedScreenshot, setSelectedScreenshot] = useState(game.bannerImage);

  // System Checker State
  const [userCpu, setUserCpu] = useState(CPU_LIST[2].name); // Default to middle tier
  const [userGpu, setUserGpu] = useState(GPU_LIST[2].name);
  const [userRam, setUserRam] = useState(RAM_LIST[2].name);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isWishlisted = wishlist.includes(game.id);
  const isAddedToCart = cart.includes(game.id);
  const isPurchased = library.includes(game.id);

  const basePrice = game.price;
  const hasDiscount = game.discount > 0;
  const activePrice = hasDiscount ? basePrice * (1 - game.discount / 100) : basePrice;

  // Retrieve compatibility tier mapping
  const selectedCpuObj = CPU_LIST.find((c) => c.name === userCpu) || CPU_LIST[0];
  const selectedGpuObj = GPU_LIST.find((g) => g.name === userGpu) || GPU_LIST[0];
  const selectedRamObj = RAM_LIST.find((r) => r.name === userRam) || RAM_LIST[0];

  const minCpuPass = selectedCpuObj.tier >= game.reqMin.cpuTier;
  const minGpuPass = selectedGpuObj.tier >= game.reqMin.gpuTier;
  const minRamPass = selectedRamObj.size >= game.reqMin.ramGb;

  const recCpuPass = selectedCpuObj.tier >= game.reqRec.cpuTier;
  const recGpuPass = selectedGpuObj.tier >= game.reqRec.gpuTier;
  const recRamPass = selectedRamObj.size >= game.reqRec.ramGb;

  const minPass = minCpuPass && minGpuPass && minRamPass;
  const recPass = recCpuPass && recGpuPass && recRamPass;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewComment.trim()) {
      setReviewError("Please type a comment.");
      return;
    }
    addReview(game.id, reviewRating, reviewComment, reviewName);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 scrollbar-thin">
        
        {/* Banner Hero */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden flex-shrink-0">
          <img
            src={selectedScreenshot}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
              {game.title}
            </h2>
            <p className="text-sm text-purple-300 mt-1 font-medium italic">
              {game.tagline}
            </p>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left / Middle: Tabs & Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === "overview"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`ml-6 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === "specs"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Rig Checker
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`ml-6 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === "reviews"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Reviews ({game.reviews.length})
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">About Game</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">{game.description}</p>
                </div>

                {/* Screenshots Carousel Selection */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Screenshots</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    <button
                      onClick={() => setSelectedScreenshot(game.bannerImage)}
                      className={`relative w-28 aspect-video rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
                        selectedScreenshot === game.bannerImage ? "border-purple-500" : "border-slate-800"
                      }`}
                    >
                      <img src={game.bannerImage} className="w-full h-full object-cover" />
                    </button>
                    {game.screenshots.map((screen, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedScreenshot(screen)}
                        className={`relative w-28 aspect-video rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
                          selectedScreenshot === screen ? "border-purple-500" : "border-slate-800"
                        }`}
                      >
                        <img src={screen} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Game Details Summary */}
                <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Developer</span>
                    <span className="text-slate-300 font-medium">{game.developer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Publisher</span>
                    <span className="text-slate-300 font-medium">{game.publisher}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Release Date</span>
                    <span className="text-slate-300 font-medium">{game.releaseDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Features</span>
                    <span className="text-slate-300 font-medium text-xs truncate">
                      {game.features.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-6">
                <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex gap-3 items-center">
                  <Monitor className="w-8 h-8 text-purple-400 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm text-purple-200">Interactive Rig Compatibility Checker</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Select your hardware configuration below, and we'll cross-reference it with the game requirements in real time.</p>
                  </div>
                </div>

                {/* Rig selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-semibold">Your CPU</label>
                    <select
                      value={userCpu}
                      onChange={(e) => setUserCpu(e.target.value)}
                      className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {CPU_LIST.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-semibold">Your Graphics Card</label>
                    <select
                      value={userGpu}
                      onChange={(e) => setUserGpu(e.target.value)}
                      className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {GPU_LIST.map((g) => (
                        <option key={g.name} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-semibold">Your RAM</label>
                    <select
                      value={userRam}
                      onChange={(e) => setUserRam(e.target.value)}
                      className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {RAM_LIST.map((r) => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Output analysis panel */}
                <div className="p-4 rounded-2xl border flex flex-col justify-between items-center sm:flex-row gap-4 transition-all duration-300 bg-slate-950/40 border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Rig Assessment</span>
                    <span className={`text-lg font-black tracking-wide ${recPass ? "text-cyan-400" : minPass ? "text-emerald-400" : "text-rose-400"}`}>
                      {recPass ? "EXCELLENT (RECOMMENDED)" : minPass ? "READY (MINIMUM PASS)" : "UPGRADE REQUIRED"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${minPass ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                      Min specs: {minPass ? "PASS" : "FAIL"}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${recPass ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-slate-500/10 border-slate-800 text-slate-400"}`}>
                      Rec specs: {recPass ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

                {/* Technical specs charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  {/* Minimum */}
                  <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-2xl space-y-3">
                    <h5 className="font-bold text-slate-300 border-b border-slate-800 pb-2 flex justify-between">
                      <span>Minimum Requirements</span>
                      <span className={minPass ? "text-emerald-400" : "text-rose-400"}>
                        {minPass ? "Pass" : "Fail"}
                      </span>
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 block">OS:</span>
                        <span className="text-slate-300 font-medium">{game.reqMin.os}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">CPU:</span>
                        <span className={`font-medium ${minCpuPass ? "text-slate-300" : "text-rose-400 font-bold"}`}>
                          {game.reqMin.cpu}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">GPU:</span>
                        <span className={`font-medium ${minGpuPass ? "text-slate-300" : "text-rose-400 font-bold"}`}>
                          {game.reqMin.gpu}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">RAM:</span>
                        <span className={`font-medium ${minRamPass ? "text-slate-300" : "text-rose-400 font-bold"}`}>
                          {game.reqMin.ram}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Storage:</span>
                        <span className="text-slate-300 font-medium">{game.reqMin.storage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended */}
                  <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-2xl space-y-3">
                    <h5 className="font-bold text-slate-300 border-b border-slate-800 pb-2 flex justify-between">
                      <span>Recommended Specs</span>
                      <span className={recPass ? "text-cyan-400" : "text-slate-400"}>
                        {recPass ? "Ready" : "Not Met"}
                      </span>
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 block">OS:</span>
                        <span className="text-slate-300 font-medium">{game.reqRec.os}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">CPU:</span>
                        <span className={`font-medium ${recCpuPass ? "text-slate-300" : "text-slate-400"}`}>
                          {game.reqRec.cpu}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">GPU:</span>
                        <span className={`font-medium ${recGpuPass ? "text-slate-300" : "text-slate-400"}`}>
                          {game.reqRec.gpu}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">RAM:</span>
                        <span className={`font-medium ${recRamPass ? "text-slate-300" : "text-slate-400"}`}>
                          {game.reqRec.ram}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Storage:</span>
                        <span className="text-slate-300 font-medium">{game.reqRec.storage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Submit review */}
                <div className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-2xl space-y-4">
                  <h5 className="font-bold text-sm text-slate-200">Share Your Experience</h5>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Your Name (optional)"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                        <span className="text-xs text-slate-400 font-bold">Rating:</span>
                        <div className="flex gap-1.5 flex-1 justify-end">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${reviewRating >= star ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <textarea
                      placeholder="Write your thoughts..."
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    {reviewError && <p className="text-xs text-rose-400">{reviewError}</p>}
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <span>Submit Review</span>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>

                {/* Review listings */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                  {game.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-slate-950/20 border border-slate-800/40 rounded-2xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold font-mono">
                            {rev.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-200">{rev.userName}</span>
                            <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-slate-700"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed pl-10">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: CTA Purchasing details */}
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-850 text-slate-100 flex flex-col gap-4 shadow-xl">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Purchase Game</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current animate-pulse" />
                  <span>{game.rating}</span>
                </div>
              </div>

              {/* Price Tag Details */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {activePrice === 0 ? "Free" : `$${activePrice.toFixed(2)}`}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-slate-500">${basePrice.toFixed(2)}</span>
                    <span className="text-[10px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded">
                      -{game.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-2 mt-2">
                {isPurchased ? (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl py-3 text-center text-emerald-400 font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>OWNED IN LIBRARY</span>
                  </div>
                ) : isAddedToCart ? (
                  <div className="w-full bg-purple-500/10 border border-purple-500/20 rounded-2xl py-3 text-center text-purple-400 font-bold flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>IN CART</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(game.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </Button>
                )}

                <Button
                  onClick={() => toggleWishlist(game.id)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-semibold cursor-pointer border flex items-center justify-center gap-2 transition-all ${
                    isWishlisted
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </Button>
              </div>

              {/* Side specs details quick recap */}
              <div className="border-t border-slate-900 pt-4 mt-2 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Release Date:</span>
                  <span className="text-slate-300 font-semibold">{game.releaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Developer:</span>
                  <span className="text-slate-300 font-semibold truncate max-w-[130px]">{game.developer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Publisher:</span>
                  <span className="text-slate-300 font-semibold truncate max-w-[130px]">{game.publisher}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl text-xs text-slate-500 space-y-2">
              <span className="font-bold block text-slate-400 uppercase tracking-wider">Marnay Guarantee</span>
              <p>Purchased digital items are added directly to your Library where you can launch, play, or install them immediately. Instant refunds are available for uninstalled games within 14 days of purchase.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameDetailsModal;
