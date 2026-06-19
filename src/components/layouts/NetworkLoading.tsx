import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, SignalLow, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface NetworkSnapshot {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  rtt?: number;
  saveData?: boolean;
}

interface NetworkLoadingProps {
  isRouteLoading: boolean;
}

const getConnection = () => {
  const nav = navigator as NavigatorWithConnection;
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
};

const getDevNetworkOverride = (): NetworkSnapshot | undefined => {
  if (!import.meta.env.DEV) return undefined;

  const mode = new URLSearchParams(window.location.search).get("network");

  if (mode === "3g") {
    return {
      downlink: 0.75,
      effectiveType: "3g",
      rtt: 650,
    };
  }

  if (mode === "slow-4g") {
    return {
      downlink: 1.6,
      effectiveType: "4g",
      rtt: 560,
    };
  }

  return undefined;
};

const getNetworkSnapshot = (): NetworkSnapshot => {
  const devOverride = getDevNetworkOverride();
  if (devOverride) return devOverride;

  const connection = getConnection();

  return {
    downlink: connection?.downlink,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
};

const isSlowConnection = (network: NetworkSnapshot) => {
  if (network.saveData) return true;
  if (
    network.effectiveType === "slow-2g" ||
    network.effectiveType === "2g" ||
    network.effectiveType === "3g"
  ) {
    return true;
  }

  return (
    network.effectiveType === "4g" &&
    ((network.downlink !== undefined && network.downlink <= 2) ||
      (network.rtt !== undefined && network.rtt >= 500))
  );
};

const getConnectionLabel = (network: NetworkSnapshot) => {
  if (network.saveData) return "Data saver";
  if (network.effectiveType === "3g") return "3G";
  if (network.effectiveType === "4g" && isSlowConnection(network)) {
    return "Slow 4G";
  }
  if (network.effectiveType) return network.effectiveType.toUpperCase();

  return "Slow network";
};

const NetworkLoading = ({ isRouteLoading }: NetworkLoadingProps) => {
  const [network, setNetwork] = useState<NetworkSnapshot>(() =>
    getNetworkSnapshot(),
  );
  const [isInitialLoading, setIsInitialLoading] = useState(
    () => document.readyState !== "complete",
  );
  const [showRouteLoading, setShowRouteLoading] = useState(false);

  const isSlow = useMemo(() => isSlowConnection(network), [network]);
  const networkLabel = useMemo(() => getConnectionLabel(network), [network]);

  useEffect(() => {
    const connection = getConnection();
    const updateNetwork = () => setNetwork(getNetworkSnapshot());

    connection?.addEventListener("change", updateNetwork);
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    return () => {
      connection?.removeEventListener("change", updateNetwork);
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
    };
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      const updateInitialLoading = window.setTimeout(
        () => setIsInitialLoading(false),
        0,
      );

      return () => window.clearTimeout(updateInitialLoading);
    }

    const finishInitialLoading = () => {
      window.setTimeout(() => setIsInitialLoading(false), isSlow ? 600 : 100);
    };

    window.addEventListener("load", finishInitialLoading, { once: true });

    return () => window.removeEventListener("load", finishInitialLoading);
  }, [isSlow]);

  useEffect(() => {
    if (!isRouteLoading) {
      const hideLoading = window.setTimeout(
        () => setShowRouteLoading(false),
        0,
      );

      return () => window.clearTimeout(hideLoading);
    }

    const delay = window.setTimeout(
      () => setShowRouteLoading(true),
      isSlow ? 0 : 280,
    );

    return () => window.clearTimeout(delay);
  }, [isRouteLoading, isSlow]);

  const showOverlay = (isInitialLoading && isSlow) || showRouteLoading;
  const showSlowNetworkBadge = isSlow && !showOverlay;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 px-4 backdrop-blur-md transition-opacity duration-300",
          showOverlay ? "opacity-100" : "opacity-0",
          !showOverlay && "invisible",
        )}
        role="status"
        aria-live="polite"
        aria-hidden={!showOverlay}
      >
        <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-purple-950/30">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10">
              <LoaderCircle className="h-7 w-7 animate-spin text-pink-400" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 ring-1 ring-slate-800">
                <SignalLow className="h-3.5 w-3.5 text-amber-300" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black uppercase tracking-wide text-white">
                Loading store
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {networkLabel} detected. Preparing images and account listings.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
              <div className="h-full w-2/3 animate-[network-loading_1.35s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="h-2 rounded-full bg-slate-800/90" />
              <span className="h-2 rounded-full bg-slate-800/70" />
              <span className="h-2 rounded-full bg-slate-800/50" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-amber-400/20 bg-slate-950/90 px-3 py-2 text-xs font-bold text-amber-100 shadow-lg shadow-slate-950/40 backdrop-blur transition-all duration-300",
          showSlowNetworkBadge
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
        role="status"
        aria-live="polite"
      >
        <Wifi className="h-3.5 w-3.5 text-amber-300" />
        <span>{networkLabel} mode</span>
      </div>
    </>
  );
};

export default NetworkLoading;