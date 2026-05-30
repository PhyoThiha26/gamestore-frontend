import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useLocation, useNavigate } from "react-router";
import { CreditCard, ArrowLeft, ShieldCheck, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CheckoutPage: React.FC = () => {
  const { cart, purchaseGames } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve discount percentage passed from the Cart drawer
  const discountPercent = location.state?.discountPercent || 0;

  // Form State
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  // Payment Status State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [validationError, setValidationError] = useState("");

  // const cartGames = games.filter((game) => cart.includes(game.id));

  // Pricing calculations
  // const rawSubtotal = cartGames.reduce((sum, game) => {
  //   const activePrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price;
  //   return sum + activePrice;
  // }, 0);

  // const discountAmount = rawSubtotal * (discountPercent / 100);
  // const total = rawSubtotal - discountAmount;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.substring(0, 19));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, "").replace(/[^0-9]/gi, "");
    if (value.length <= 2) {
      setExpiry(value);
    } else {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  // Format CVV (max 3 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    setCvv(value.substring(0, 3));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim() || !cardNumber || !expiry || !cvv || !address.trim()) {
      setValidationError("Please fill in all credit card and billing details.");
      return;
    }
    if (cardNumber.length < 19) {
      setValidationError("Invalid Card Number. Must be 16 digits.");
      return;
    }
    if (expiry.length < 5) {
      setValidationError("Invalid Expiry date. Format MM/YY.");
      return;
    }
    if (cvv.length < 3) {
      setValidationError("Invalid CVV. Must be 3 digits.");
      return;
    }

    // Begin Simulated Payment Flow
    setIsProcessing(true);
    setProcessingStep(0);

    const steps = [
      "Contacting secure gateway...",
      "Encrypting credit card credentials...",
      "Authorizing transactions with bank...",
      "Finalizing purchase invoice...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStep(currentStep);
      } else {
        clearInterval(interval);
        // Complete purchase
        const generatedOrderId = `M-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedOrderId);
        setIsProcessing(false);
        setIsSuccess(true);
        // Add games to library and clear cart
        purchaseGames(cart);
      }
    }, 1200);
  };

  const stepsText = [
    "Contacting secure gateway...",
    "Encrypting credit card credentials...",
    "Authorizing transactions with bank...",
    "Finalizing purchase invoice...",
  ];

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Payment Received</span>
            <h1 className="text-3xl font-black text-white mt-1">THANK YOU FOR YOUR ORDER!</h1>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-medium text-sm">Receipt invoice</span>
            <span className="text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded">
              {orderId}
            </span>
          </div>

          {/* <div className="space-y-2 text-sm">
            {cartGames.map((game) => (
              <div key={game.id} className="flex justify-between">
                <span className="text-slate-300 truncate max-w-[250px]">{game.title}</span>
                <span className="text-slate-400 font-mono">
                  ${(game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div> */}

          {/* <div className="border-t border-slate-800 pt-3 space-y-2 text-sm">
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Voucher Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-white">
              <span>Total charged</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-mono">
                ${total.toFixed(2)}
              </span>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/library")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
          >
            <span>Go to My Library</span>
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white py-3.5 px-8 rounded-xl cursor-pointer"
          >
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Return to store */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-400 hover:text-purple-400 font-semibold text-sm transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog Store</span>
      </button>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Billing details form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">Secure Checkout</h2>
                <p className="text-slate-500 text-xs mt-0.5">Please provide credit details to finalize order.</p>
              </div>
            </div>

            {/* Validation errors */}
            {validationError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                {validationError}
              </p>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isProcessing}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Credit Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardChange}
                    disabled={isProcessing}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Expiration */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    disabled={isProcessing}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">CVV Code</label>
                  <input
                    type="password"
                    required
                    placeholder="***"
                    value={cvv}
                    onChange={handleCvvChange}
                    disabled={isProcessing}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Billing Zip / Address */}
                <div className="sm:col-span-1">
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Zip Code / Address</label>
                  <input
                    type="text"
                    required
                    placeholder="10001 NY"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isProcessing}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              {/* Secure terms */}
              <div className="pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Encrypted using SSL 256-bit TLS protocol. Secure connection established.</span>
              </div>

              {/* Pay trigger */}
              {!isProcessing ? (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {/* <span>AUTHORIZE AND CHARGE ${total.toFixed(2)}</span> */}
                </Button>
              ) : (
                <div className="w-full bg-slate-900 border border-slate-850 py-4 rounded-xl flex flex-col items-center justify-center gap-2">
                  {/* Custom animated ring spinner */}
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    {stepsText[processingStep]}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order details summary card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl text-slate-200">
          {/* <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
            Order Review ({cartGames.length})
          </h3> */}

          {/* <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
            {cartGames.map((game) => {
              const activePrice = game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price;
              return (
                <div key={game.id} className="flex gap-3">
                  <img src={game.coverImage} alt={game.title} className="w-10 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold truncate text-white">{game.title}</h4>
                    <span className="text-[10px] text-slate-500 block truncate">{game.developer}</span>
                    <span className="text-[11px] font-bold text-purple-300 font-mono mt-1 block">
                      ${activePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div> */}

          <div className="border-t border-slate-850 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              {/* <span>${rawSubtotal.toFixed(2)}</span> */}
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Voucher discount ({discountPercent}%)</span>
                {/* <span>-${discountAmount.toFixed(2)}</span> */}
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-850/60 pt-2 text-base">
              <span>Order Total</span>
              {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-mono">
                ${total.toFixed(2)}
              </span> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
