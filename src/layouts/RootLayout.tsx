import Footer from "@/components/layouts/Footer";
import Header  from "@/components/layouts/Header";
import { Outlet, useLocation } from "react-router";
import { StoreProvider } from "@/context/StoreContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { useEffect } from "react";

const RootLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return ( 
        <StoreProvider>
            <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-slate-950 text-slate-100 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
                <Header />
                <main className="w-full max-w-full flex-grow overflow-x-hidden">
                    {/* Main content will go here */}
                    <Outlet />
                </main>
                <Footer />
                <CartDrawer />
            </div>
        </StoreProvider>
     );
}
 
export default RootLayout;
