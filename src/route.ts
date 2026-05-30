import { createBrowserRouter } from "react-router";
import App from "./pages/App";
import RootLayout from "./layouts/RootLayout";
import LibraryPage from "./pages/LibraryPage";
import CheckoutPage from "./pages/CheckoutPage";
import SellAccountPage from "./pages/SellAccountPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: App },
      { path: "library", Component: LibraryPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "sell/:gameType", Component: SellAccountPage },
    ],
  },
]);

