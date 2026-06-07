import { createBrowserRouter } from "react-router";
import App from "./pages/App";
import RootLayout from "./layouts/RootLayout";
import LibraryPage from "./pages/LibraryPage";
import CheckoutPage from "./pages/CheckoutPage";
import SellAccountPage from "./pages/SellAccountPage";
import SeeMorePage from "./pages/SeeMorePage";
import AccountDetailPage from "./pages/AccountDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: App },
      { path: "library", Component: LibraryPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "sell/:gameType", Component: SellAccountPage },
      { path: "see-more/:gameType", Component: SeeMorePage },
      { path: "SeeMore", Component: SeeMorePage },
      { path: "accounts/:accountId", Component: AccountDetailPage },
    ],
  },
]);

