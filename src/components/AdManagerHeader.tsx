import React, { useState, useEffect } from "react";
import { useBrowser } from "../context/BrowserContext";
import { UserProfilePopover } from "./UserProfilePopover";
import { WindowControls } from "./WindowControls";
import { getCurrentWindow } from "@tauri-apps/api/window";

const AdManagerLogoFavicon = () => (
  <img
    src="https://www.gstatic.com/admanager/logo_admanager_2x.png"
    width="14"
    height="14"
    alt="Ad Manager"
    style={{ display: "block", objectFit: "contain" }}
  />
);

export const AdManagerHeader: React.FC = () => {
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
    setIsSettingsModalOpen,
    adManagerNetworkCode,
    userProfileEmail,
  } = useBrowser();

  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);

  const cleanUrlDisplay = (url: string) => {
    return url.replace(/^https?:\/\//i, "");
  };

  // Dynamic URL construction with custom network code ID
  const displayUrl =
    currentEntry.pageId === "payments-info" || currentEntry.pageId === "transactions-service"
      ? `admanager.google.com/${adManagerNetworkCode}#payments`
      : `admanager.google.com/${adManagerNetworkCode}#inventory/site/list`;

  const [inputUrl, setInputUrl] = useState(() => cleanUrlDisplay(displayUrl));

  useEffect(() => {
    setInputUrl(displayUrl);
  }, [displayUrl]);

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
      {/* 1. Top Tab Bar & Window Drag Strip */}
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
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Tab List */}
        <div className="chrome-tabs-wrapper" data-tauri-drag-region onMouseDown={handleStartDrag}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const tabCurrent = tab.history[tab.historyIndex] || { title: "Google Ad Manager - Sites", url: "" };
            const tabTitle = tabCurrent.pageId?.includes("payment")
              ? "Google Ad Manager - Payments info"
              : "Google Ad Manager - Sites";

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
                    <AdManagerLogoFavicon />
                  </span>
                  <span className="tab-title" title={tabTitle} data-tauri-drag-region>
                    {tabTitle}
                  </span>
                  {tabs.length > 1 && (
                    <button
                      className="tab-close-btn"
                      onClick={(e) => closeTab(tab.id, e)}
                      onMouseDown={stopProp}
                      title="Close tab"
                    >
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
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
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Flexible Drag Region Spacer */}
        <div className="chrome-drag-spacer" data-tauri-drag-region onMouseDown={handleStartDrag} />

        {/* Custom Window Minimize / Maximize / Close Buttons */}
        <WindowControls />
      </div>

      {/* 2. Bottom Address Toolbar */}
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
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
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
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
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
              width="13"
              height="13"
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
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
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
          {/* Right Action Icons in Address Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "6px" }}>
            <button type="button" className="chrome-icon-btn address-action-btn" title="Translate this page">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
            </button>
            <button type="button" className="chrome-icon-btn address-action-btn" title="Bookmark this tab">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.8 5.8L14 6.3L10.9 9.2L11.7 13.3L8 11.2L4.3 13.3L5.1 9.2L2 6.3L6.2 5.8L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right Toolbar Action Icons (Matching Main Branch) */}
        <div className="chrome-action-group" onMouseDown={stopProp}>
          {/* User Profile Avatar -> Opens Global Settings Modal */}
          <button
            className="chrome-profile-btn"
            title="Google Account & Global Settings"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <span className="profile-avatar">
              {userProfileEmail && userProfileEmail.trim().length > 0
                ? userProfileEmail.trim().charAt(0).toUpperCase()
                : "A"}
            </span>
          </button>

          {/* 3-dots Menu */}
          <button className="chrome-icon-btn action-btn" title="Customize and control Google Chrome">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="3.5" r="1.3" fill="currentColor" />
              <circle cx="8" cy="8" r="1.3" fill="currentColor" />
              <circle cx="8" cy="12.5" r="1.3" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Ad Manager Header Sub-bar */}
      <div className="adm-header-bar">
        <div className="adm-header-left">
          <button className="adm-icon-btn adm-hamburger-btn" title="Toggle menu" onMouseDown={stopProp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {/* Ad Manager Logo & Title */}
          <div className="adm-logo-wrap">
            <img
              src="https://www.gstatic.com/admanager/logo_admanager_2x.png"
              width="26"
              height="26"
              alt="Ad Manager"
              style={{ marginRight: "10px", display: "block", objectFit: "contain" }}
            />
            <span className="adm-logo-title">Ad Manager</span>
          </div>
        </div>

        {/* Middle Search Input */}
        <div className="adm-search-container" onMouseDown={stopProp}>
          <svg className="adm-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search for tools, features, and more"
            readOnly
          />
        </div>

        {/* Right Tools & User Profile */}
        <div className="adm-header-right">
          {/* 1. Help Icon (?) */}
          <button className="adm-icon-btn" title="Help" onMouseDown={stopProp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>

          {/* 2. Notification Bell (Outline) */}
          <button className="adm-icon-btn" title="Notifications" onMouseDown={stopProp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          {/* 3. Vertical 3-Dots Menu (⋮) */}
          <button className="adm-icon-btn" title="More options" onMouseDown={stopProp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {/* 4. Google Account Blue Profile Avatar -> Toggles UserProfilePopover */}
          <div
            className="adm-blue-user-avatar"
            title="Google Account"
            onMouseDown={stopProp}
            onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a73e8">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>

            <UserProfilePopover
              isOpen={isProfilePopoverOpen}
              onClose={() => setIsProfilePopoverOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
