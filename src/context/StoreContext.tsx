/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { gamesData } from "@/lib/gamesData";
import type { Game, Review } from "@/lib/gamesData";

interface StoreContextType {
  games: Game[];
  cart: string[]; // game IDs
  wishlist: string[]; // game IDs
  library: string[]; // game IDs (purchased)
  installed: string[]; // game IDs installed
  theme: "dark" | "light";
  searchQuery: string;
  selectedGenre: string;
  selectedPlatform: string;
  sortBy: string;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  purchaseGames: (ids: string[]) => void;
  setInstalled: (id: string) => void;
  addReview: (gameId: string, rating: number, comment: string, userName: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSelectedPlatform: (platform: string) => void;
  setSortBy: (sort: string) => void;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem("marnay_games");
    return saved ? JSON.parse(saved) : gamesData;
  });

  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem("marnay_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("marnay_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [library, setLibrary] = useState<string[]>(() => {
    const saved = localStorage.getItem("marnay_library");
    return saved ? JSON.parse(saved) : [];
  });

  const [installed, setInstalledList] = useState<string[]>(() => {
    const saved = localStorage.getItem("marnay_installed");
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("marnay_theme");
    return (saved as "dark" | "light") || "dark";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("marnay_games", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem("marnay_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("marnay_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("marnay_library", JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem("marnay_installed", JSON.stringify(installed));
  }, [installed]);

  useEffect(() => {
    localStorage.setItem("marnay_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const addToCart = (id: string) => {
    if (!cart.includes(id) && !library.includes(id)) {
      setCart((prev) => [...prev, id]);
      setCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const purchaseGames = (ids: string[]) => {
    setLibrary((prev) => {
      const updated = [...prev];
      ids.forEach((id) => {
        if (!updated.includes(id)) {
          updated.push(id);
        }
      });
      return updated;
    });
    setCart((prev) => prev.filter((id) => !ids.includes(id)));
  };


  const setInstalled = (id: string) => {
    if (!installed.includes(id)) {
      setInstalledList((prev) => [...prev, id]);
    }
  };

  const addReview = (gameId: string, rating: number, comment: string, userName: string) => {
    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.id === gameId) {
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            userName: userName || "Anonymous Gamer",
            rating,
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            comment,
          };
          const updatedReviews = [newReview, ...game.reviews];
          const avgRating =
            updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
            updatedReviews.length;
          return {
            ...game,
            rating: parseFloat(avgRating.toFixed(1)),
            reviews: updatedReviews,
          };
        }
        return game;
      })
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <StoreContext.Provider
      value={{
        games,
        cart,
        wishlist,
        library,
        installed,
        theme,
        searchQuery,
        selectedGenre,
        selectedPlatform,
        sortBy,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        purchaseGames,
        setInstalled,
        addReview,
        setSearchQuery,
        setSelectedGenre,
        setSelectedPlatform,
        setSortBy,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
