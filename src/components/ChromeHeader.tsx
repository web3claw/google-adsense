import React, { useState, useEffect } from "react";
import { useBrowser } from "../context/BrowserContext";
import { WindowControls } from "./WindowControls";
import { getCurrentWindow } from "@tauri-apps/api/window";

// Google AdSense SVG Logo
const AdSenseLogo = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
    <path d="M42 38L24 6L6 38H42Z" fill="#F4B400" />
    <path d="M24 6L6 38H18L24 27.5L30 38H42L24 6Z" fill="#4285F4" />
    <path d="M18 38H30L24 27.5L18 38Z" fill="#0F9D58" />
  </svg>
);

export const ChromeHeader: React.FC = () => {
  const {
    currentEntry,
    canGoBack,
    canGoForward,
    isRefreshing,
    tabs,
    activeTabId,
    setActiveTabId,
    goBack,
    goForward,
    refresh,
    navigateTo,
    addTab,
    closeTab,
  } = useBrowser();

  const [inputUrl, setInputUrl] = useState(currentEntry.url);

  useEffect(() => {
    setInputUrl(currentEntry.url);
  }, [currentEntry.url]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo({
      title: inputUrl.replace(/^https?:\/\//, ""),
      url: inputUrl,
      pageId: "custom",
    });
  };

  const handleStartDrag = (e: React.MouseEvent) => {
    if (e.button === 0) {
      try {
        const appWindow = getCurrentWindow();
        appWindow.startDragging();
      } catch (err) {
        console.warn("Tauri startDragging fallback", err);
      }
    }
  };

  const stopProp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header className="chrome-header-container">
      {/* Top Tab Bar & Window Drag Strip */}
      <div
        className="chrome-tabbar"
        data-tauri-drag-region
        onMouseDown={handleStartDrag}
      >
        {/* Leftmost dropdown icon button */}
        <button
          className="chrome-icon-btn tab-menu-btn"
          title="Tabs menu"
          onMouseDown={stopProp}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Tab List */}
        <div className="chrome-tabs-wrapper" data-tauri-drag-region onMouseDown={handleStartDrag}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const tabCurrent = tab.history[tab.historyIndex] || { title: "Tab", url: "" };
            return (
              <div
                key={tab.id}
                className={`chrome-tab ${isActive ? "active" : ""}`}
                data-tauri-drag-region
                onClick={() => setActiveTabId(tab.id)}
                onMouseDown={handleStartDrag}
              >
                {/* Left tab curve shadow/edge decoration */}
                <div className="tab-corner tab-corner-left" />
                
                <div className="tab-content" data-tauri-drag-region>
                  <span className="tab-favicon" data-tauri-drag-region>
                    <AdSenseLogo />
                  </span>
                  <span className="tab-title" title={tabCurrent.title} data-tauri-drag-region>
                    {tabCurrent.title}
                  </span>
                  <button
                    className="tab-close-btn"
                    onClick={(e) => closeTab(tab.id, e)}
                    onMouseDown={stopProp}
                    title="Close tab"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Right tab curve shadow/edge decoration */}
                <div className="tab-corner tab-corner-right" />
              </div>
            );
          })}

          {/* New Tab (+) Button */}
          <button
            className="chrome-icon-btn add-tab-btn"
            onClick={addTab}
            onMouseDown={stopProp}
            title="New tab"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Flexible Drag Region Spacer */}
        <div className="chrome-drag-spacer" data-tauri-drag-region onMouseDown={handleStartDrag} />

        {/* Custom Window Minimize / Maximize / Close Buttons */}
        <WindowControls />
      </div>

      {/* Bottom Address Toolbar */}
      <div className="chrome-toolbar">
        {/* Navigation Buttons: Back, Forward, Reload */}
        <div className="chrome-nav-group">
          {/* Back Button */}
          <button
            className={`chrome-icon-btn nav-btn ${!canGoBack ? "disabled" : ""}`}
            onClick={goBack}
            onMouseDown={stopProp}
            title="Click to go back"
            disabled={!canGoBack}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3.5L4.5 8L10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Forward Button */}
          <button
            className={`chrome-icon-btn nav-btn ${!canGoForward ? "disabled" : ""}`}
            onClick={goForward}
            onMouseDown={stopProp}
            title="Click to go forward"
            disabled={!canGoForward}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3.5L11.5 8L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Reload / Refresh Button */}
          <button
            className="chrome-icon-btn nav-btn"
            onClick={refresh}
            onMouseDown={stopProp}
            title="Reload this page"
          >
            <svg
              className={isRefreshing ? "refresh-spinning" : ""}
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C10.2 2.5 12.09 3.8 12.98 5.67M13.5 2.5V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Address Bar Form */}
        <form className="chrome-address-bar" onSubmit={handleUrlSubmit} onMouseDown={stopProp}>
          <div className="address-bar-icon site-info-icon" title="View site information">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 5.5H13M3 10.5H13M5.5 3V8M10.5 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            className="address-bar-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Search Google or type a URL"
          />
        </form>

        {/* Right Toolbar Action Icons */}
        <div className="chrome-action-group" onMouseDown={stopProp}>
          {/* Side Panel / Extensions */}
          <button className="chrome-icon-btn action-btn" title="Side panel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9.5 2.5V13.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>

          {/* Star Bookmark */}
          <button className="chrome-icon-btn action-btn" title="Bookmark this tab">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L9.8 5.8L14 6.3L10.9 9.2L11.7 13.3L8 11.2L4.3 13.3L5.1 9.2L2 6.3L6.2 5.8L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </button>

          {/* User Profile Avatar */}
          <button className="chrome-profile-btn" title="Google Account">
            <span className="profile-avatar">A</span>
          </button>

          {/* 3-dots Menu */}
          <button className="chrome-icon-btn action-btn" title="Customize and control Google Chrome">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3.5" r="1.3" fill="currentColor" />
              <circle cx="8" cy="8" r="1.3" fill="currentColor" />
              <circle cx="8" cy="12.5" r="1.3" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
