import React, { createContext, useContext, useState } from "react";

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
  refreshKey: number;
  tabs: TabItem[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  navigateTo: (entry: HistoryEntry) => void;
  addTab: () => void;
  closeTab: (id: string, e: React.MouseEvent) => void;
}

const defaultHistory: HistoryEntry[] = [
  {
    title: "Sites – Google AdSense",
    url: "adsense.google.com/adsense/u/0/pub-222938054781862/sites/list",
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
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || defaultTab;
  const currentEntry = activeTab.history[activeTab.historyIndex] || defaultHistory[0];

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const navigateTo = (entry: HistoryEntry) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        // Trim forward history and append new entry
        const updatedHistory = [...tab.history.slice(0, tab.historyIndex + 1), entry];
        return {
          ...tab,
          history: updatedHistory,
          historyIndex: updatedHistory.length - 1,
        };
      })
    );
  };

  const goBack = () => {
    if (!canGoBack) return;
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        return {
          ...tab,
          historyIndex: Math.max(0, tab.historyIndex - 1),
        };
      })
    );
  };

  const goForward = () => {
    if (!canGoForward) return;
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        return {
          ...tab,
          historyIndex: Math.min(tab.history.length - 1, tab.historyIndex + 1),
        };
      })
    );
  };

  const refresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
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

  return (
    <BrowserContext.Provider
      value={{
        activeTab,
        currentEntry,
        canGoBack,
        canGoForward,
        isRefreshing,
        refreshKey,
        tabs,
        activeTabId,
        setActiveTabId,
        goBack,
        goForward,
        refresh,
        navigateTo,
        addTab,
        closeTab,
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
