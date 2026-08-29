import React, { createContext, useContext, useState, useEffect } from "react";

export interface HistoryEntry {
  title: string;
  url: string;
  pageId: string;
  targetMonth?: string;
}

export interface TabItem {
  id: string;
  history: HistoryEntry[];
  historyIndex: number;
}

interface BrowserContextType {
  activeTab: TabItem;
  currentEntry: HistoryEntry;
  canGoBack: boolean;
  canGoForward: boolean;
  isRefreshing: boolean;
  isNavigatingLoading: boolean;
  refreshKey: number;
  tabs: TabItem[];
  activeTabId: string;
  // Global Settings State
  networkDelay: number;
  currencySymbol: string;
  uiScalePercent: number;
  isSettingsModalOpen: boolean;

  // User Profile Settings State
  userProfileName: string;
  userProfileEmail: string;

  // Actions
  setActiveTabId: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  navigateTo: (entry: HistoryEntry) => void;
  updateCurrentEntry: (entry: Partial<HistoryEntry>) => void;
  addTab: () => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  setNetworkDelay: (ms: number) => void;
  setCurrencySymbol: (symbol: string) => void;
  setUiScalePercent: (val: number) => void;
  setUserProfileName: (name: string) => void;
  setUserProfileEmail: (email: string) => void;
  formatCurrency: (val: string | number) => string;
}

const defaultHistory: HistoryEntry[] = [
  {
    title: "Sites – Google AdSense",
    url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/sites/list",
    pageId: "sites-list",
  },
];

const defaultTab: TabItem = {
  id: "1",
  history: defaultHistory,
  historyIndex: 0,
};

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<TabItem[]>([defaultTab]);
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isNavigatingLoading, setIsNavigatingLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Global Unified Network Delay (0ms - 50000ms, Default: 1000ms)
  const [networkDelay, setNetworkDelayState] = useState<number>(() => {
    const saved = localStorage.getItem("adsense_network_delay");
    return saved ? Number(saved) : 1000;
  });

  const [currencySymbol, setCurrencySymbolState] = useState<string>(() => {
    const saved = localStorage.getItem("adsense_currency_symbol");
    if (saved) return saved;
    try {
      const ec = localStorage.getItem("earnings_config");
      if (ec) {
        const parsed = JSON.parse(ec);
        if (parsed.currencyCode === "EUR" || parsed.currencyCode === "€") return "€";
        if (parsed.currencyCode === "GBP" || parsed.currencyCode === "£") return "£";
        if (parsed.currencyCode === "CNY" || parsed.currencyCode === "¥") return "¥";
        if (parsed.currencyCode === "HKD" || parsed.currencyCode === "HK$") return "HK$";
      }
    } catch (e) {}
    return "$";
  });

  // UI Scale Percent (70% - 160%, Default: 110%)
  const [uiScalePercent, setUiScalePercentState] = useState<number>(() => {
    const saved = localStorage.getItem("adsense_ui_scale_percent");
    return saved ? Number(saved) : 110;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const [userProfileName, setUserProfileNameState] = useState<string>(() => {
    return localStorage.getItem("adsense_profile_name") || "Sashmita Caglar";
  });

  const [userProfileEmail, setUserProfileEmailState] = useState<string>(() => {
    return localStorage.getItem("adsense_profile_email") || "sashmitacaglar@gmail.com";
  });

  useEffect(() => {
    localStorage.setItem("adsense_profile_name", userProfileName);
  }, [userProfileName]);

  useEffect(() => {
    localStorage.setItem("adsense_profile_email", userProfileEmail);
  }, [userProfileEmail]);

  useEffect(() => {
    localStorage.setItem("adsense_network_delay", String(networkDelay));
  }, [networkDelay]);

  useEffect(() => {
    localStorage.setItem("adsense_currency_symbol", currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem("adsense_ui_scale_percent", String(uiScalePercent));
    const factor = uiScalePercent / 100;
    const invFactor = 1 / factor;
    document.documentElement.style.zoom = "1";
    (document.body.style as any).zoom = "1";
    document.documentElement.style.setProperty("--ui-scale-factor", factor.toString());
    document.documentElement.style.setProperty("--inverse-scale-factor", invFactor.toString());
  }, [uiScalePercent]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || defaultTab;
  const currentEntry = activeTab.history[activeTab.historyIndex] || defaultHistory[0];

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const navigateTo = (entry: HistoryEntry) => {
    if (networkDelay > 0) {
      setIsNavigatingLoading(true);
      setTimeout(() => {
        setIsNavigatingLoading(false);
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id !== activeTabId) return tab;
            const updatedHistory = [...tab.history.slice(0, tab.historyIndex + 1), entry];
            return {
              ...tab,
              history: updatedHistory,
              historyIndex: updatedHistory.length - 1,
            };
          })
        );
      }, networkDelay);
    } else {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const updatedHistory = [...tab.history.slice(0, tab.historyIndex + 1), entry];
          return {
            ...tab,
            history: updatedHistory,
            historyIndex: updatedHistory.length - 1,
          };
        })
      );
    }
  };

  const updateCurrentEntry = (entry: Partial<HistoryEntry>) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        const cur = tab.history[tab.historyIndex];
        const updated = { ...cur, ...entry };
        const newHist = [...tab.history];
        newHist[tab.historyIndex] = updated;
        return {
          ...tab,
          history: newHist,
        };
      })
    );
  };

  const goBack = () => {
    if (!canGoBack) return;
    if (networkDelay > 0) {
      setIsNavigatingLoading(true);
      setTimeout(() => {
        setIsNavigatingLoading(false);
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id !== activeTabId) return tab;
            return {
              ...tab,
              historyIndex: tab.historyIndex - 1,
            };
          })
        );
      }, networkDelay);
    } else {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          return {
            ...tab,
            historyIndex: tab.historyIndex - 1,
          };
        })
      );
    }
  };

  const goForward = () => {
    if (!canGoForward) return;
    if (networkDelay > 0) {
      setIsNavigatingLoading(true);
      setTimeout(() => {
        setIsNavigatingLoading(false);
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id !== activeTabId) return tab;
            return {
              ...tab,
              historyIndex: tab.historyIndex + 1,
            };
          })
        );
      }, networkDelay);
    } else {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          return {
            ...tab,
            historyIndex: tab.historyIndex + 1,
          };
        })
      );
    }
  };

  const refresh = () => {
    if (networkDelay > 0) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshKey((prev) => prev + 1);
      }, networkDelay);
    } else {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshKey((prev) => prev + 1);
      }, 300);
    }
  };

  const addTab = () => {
    const newId = Date.now().toString();
    const newTabItem: TabItem = {
      id: newId,
      history: defaultHistory,
      historyIndex: 0,
    };
    setTabs([...tabs, newTabItem]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Keep at least one tab
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const formatCurrency = (val: string | number): string => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    let sym = currencySymbol || "$";
    if (!currencySymbol || currencySymbol === "$") {
      try {
        const ec = localStorage.getItem("adsense_earnings_config");
        if (ec) {
          const parsed = JSON.parse(ec);
          if (parsed.currencyCode === "EUR" || parsed.currencyCode === "€") sym = "€";
          else if (parsed.currencyCode === "GBP" || parsed.currencyCode === "£") sym = "£";
          else if (parsed.currencyCode === "CNY" || parsed.currencyCode === "¥") sym = "¥";
          else if (parsed.currencyCode === "HKD" || parsed.currencyCode === "HK$") sym = "HK$";
        }
      } catch (e) {}
    }
    if (isNaN(num)) return `${sym}0.00`;
    return `${sym}${num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <BrowserContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        currentEntry,
        canGoBack,
        canGoForward,
        isRefreshing,
        isNavigatingLoading,
        refreshKey,
        networkDelay,
        currencySymbol,
        uiScalePercent,
        isSettingsModalOpen,
        userProfileName,
        userProfileEmail,
        setActiveTabId,
        goBack,
        goForward,
        refresh,
        navigateTo,
        updateCurrentEntry,
        addTab,
        closeTab,
        setIsSettingsModalOpen,
        setNetworkDelay: setNetworkDelayState,
        setCurrencySymbol: setCurrencySymbolState,
        setUiScalePercent: setUiScalePercentState,
        setUserProfileName: setUserProfileNameState,
        setUserProfileEmail: setUserProfileEmailState,
        formatCurrency,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowser must be used within a BrowserProvider");
  }
  return context;
};
