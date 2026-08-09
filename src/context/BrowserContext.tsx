import React, { createContext, useContext, useState, useEffect } from "react";

export interface HistoryEntry {
  title: string;
  url: string;
  pageId: string;
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
  isSettingsModalOpen: boolean;

  // Actions
  setActiveTabId: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  navigateTo: (entry: HistoryEntry) => void;
  addTab: () => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  setNetworkDelay: (ms: number) => void;
  setCurrencySymbol: (symbol: string) => void;
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
    return localStorage.getItem("adsense_currency_symbol") || "$";
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("adsense_network_delay", String(networkDelay));
  }, [networkDelay]);

  useEffect(() => {
    localStorage.setItem("adsense_currency_symbol", currencySymbol);
  }, [currencySymbol]);

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
              historyIndex: Math.max(0, tab.historyIndex - 1),
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
            historyIndex: Math.max(0, tab.historyIndex - 1),
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
              historyIndex: Math.min(tab.history.length - 1, tab.historyIndex + 1),
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
            historyIndex: Math.min(tab.history.length - 1, tab.historyIndex + 1),
          };
        })
      );
    }
  };

  const refresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, networkDelay);
  };

  const addTab = () => {
    const newId = String(Date.now());
    const newTabItem: TabItem = {
      id: newId,
      history: [
        {
          title: "New Tab",
          url: "chrome://newtab",
          pageId: "new-tab",
        },
      ],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTabItem]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  const formatCurrency = (val: string | number): string => {
    if (val === null || val === undefined) return `${currencySymbol}0.00`;
    const str = String(val).trim();
    // Replace any currency symbol at the beginning
    const numPart = str.replace(/^[^0-9.-]+/, "");
    return `${currencySymbol}${numPart}`;
  };

  return (
    <BrowserContext.Provider
      value={{
        activeTab,
        currentEntry,
        canGoBack,
        canGoForward,
        isRefreshing,
        isNavigatingLoading,
        refreshKey,
        tabs,
        activeTabId,
        networkDelay,
        currencySymbol,
        isSettingsModalOpen,
        setActiveTabId,
        goBack,
        goForward,
        refresh,
        navigateTo,
        addTab,
        closeTab,
        setIsSettingsModalOpen,
        setNetworkDelay: setNetworkDelayState,
        setCurrencySymbol: setCurrencySymbolState,
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
