import React, { useState } from "react";
import { useBrowser } from "../context/BrowserContext";

// SVGs matching Google Material Symbols exactly
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 18H21M3 12H21M3 6H21" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AdSenseFullLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
      <path d="M42 38L24 6L6 38H42Z" fill="#F4B400" />
      <path d="M24 6L6 38H18L24 27.5L30 38H42L24 6Z" fill="#4285F4" />
      <path d="M18 38H30L24 27.5L18 38Z" fill="#0F9D58" />
    </svg>
    <span style={{ fontSize: "20px", fontWeight: 400, color: "#3c4043", fontFamily: "Google Sans, Roboto, sans-serif", letterSpacing: "-0.5px" }}>
      <strong style={{ fontWeight: 500, color: "#5f6368" }}>Google</strong> <span style={{ color: "#5f6368" }}>AdSense</span>
    </span>
  </div>
);

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Menu Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AdsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 8h4v4H7z" />
    <path d="M15 8h2M15 12h2M7 16h10" />
  </svg>
);

const SitesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const PrivacyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    <path d="M12 14c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" />
  </svg>
);

const BrandSafetyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 17v-4M12 17V7M17 17v-7" />
  </svg>
);

const OptimizationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const PolicyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const PaymentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6" cy="15" r="1" fill="currentColor" />
  </svg>
);

const DotIcon = ({ active }: { active?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={active ? "#1A73E8" : "#5F6368"}>
    <circle cx="12" cy="12" r="5" />
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const { currentEntry, navigateTo } = useBrowser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paymentsExpanded, setPaymentsExpanded] = useState(true);
  const [brandSafetyExpanded, setBrandSafetyExpanded] = useState(false);
  const [optimizationExpanded, setOptimizationExpanded] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(false);

  const activePageId = currentEntry.pageId;

  const handleNav = (pageId: string, title: string, path: string) => {
    navigateTo({
      title: `${title} – Google AdSense`,
      url: `adsense.google.com/adsense/u/0/pub-222938054781862/${path}`,
      pageId,
    });
  };

  return (
    <aside className={`adsense-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Top Header Section */}
      <div className="sidebar-header">
        <button
          className="sidebar-hamburger-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle Navigation Menu"
        >
          <HamburgerIcon />
        </button>
        {!isCollapsed && <AdSenseFullLogo />}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {/* Group 1 */}
        <div className="sidebar-group">
          <div
            className={`sidebar-item ${activePageId === "home" ? "active" : ""}`}
            onClick={() => handleNav("home", "Home", "home")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><HomeIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Home</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "ads" ? "active" : ""}`}
            onClick={() => handleNav("ads", "Ads", "ads/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><AdsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Ads</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "sites-list" || activePageId === "site-detail" ? "active" : ""}`}
            onClick={() => handleNav("sites-list", "Sites", "sites/list")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><SitesIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Sites</span>}
            </div>
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Group 2 */}
        <div className="sidebar-group">
          <div
            className={`sidebar-item ${activePageId === "privacy" ? "active" : ""}`}
            onClick={() => handleNav("privacy", "Privacy & messaging", "privacy/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><PrivacyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Privacy & messaging</span>}
            </div>
          </div>

          <div
            className={`sidebar-item expandable ${activePageId === "brand-safety" ? "active" : ""}`}
            onClick={() => setBrandSafetyExpanded(!brandSafetyExpanded)}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {brandSafetyExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><BrandSafetyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Brand safety</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "earnings" || activePageId === "reports" ? "active" : ""}`}
            onClick={() => handleNav("reports", "Reports", "reports/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><ReportsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Reports</span>}
            </div>
          </div>

          <div
            className={`sidebar-item expandable ${activePageId === "optimization" ? "active" : ""}`}
            onClick={() => setOptimizationExpanded(!optimizationExpanded)}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {optimizationExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><OptimizationIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Optimization</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "policy" ? "active" : ""}`}
            onClick={() => handleNav("policy", "Policy center", "policy/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><PolicyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Policy center</span>}
            </div>
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Group 3 */}
        <div className="sidebar-group">
          {/* Payments Group */}
          <div
            className="sidebar-item expandable"
            onClick={() => setPaymentsExpanded(!paymentsExpanded)}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {paymentsExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><PaymentsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Payments</span>}
            </div>
          </div>

          {/* Payments Sub-items */}
          {paymentsExpanded && !isCollapsed && (
            <div className="sidebar-subgroup">
              <div
                className={`sidebar-item subitem ${activePageId === "payments-info" ? "active" : ""}`}
                onClick={() => handleNav("payments-info", "Payments info", "payments/info")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "payments-info"} /></span>
                  <span className="sidebar-label">Payments info</span>
                </div>
              </div>

              <div
                className={`sidebar-item subitem ${activePageId === "verification-check" ? "active" : ""}`}
                onClick={() => handleNav("verification-check", "Verification check", "payments/verification")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "verification-check"} /></span>
                  <span className="sidebar-label">Verification check</span>
                </div>
              </div>
            </div>
          )}

          {/* Account Group */}
          <div
            className={`sidebar-item expandable ${activePageId === "settings" || activePageId === "account" ? "active" : ""}`}
            onClick={() => setAccountExpanded(!accountExpanded)}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {accountExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><AccountIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Account</span>}
            </div>
          </div>

          {/* Account Sub-items */}
          {accountExpanded && !isCollapsed && (
            <div className="sidebar-subgroup">
              <div
                className={`sidebar-item subitem ${activePageId === "settings" ? "active" : ""}`}
                onClick={() => handleNav("settings", "Account Settings", "settings/account")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "settings"} /></span>
                  <span className="sidebar-label">Access & authorization</span>
                </div>
              </div>
            </div>
          )}

          <div
            className={`sidebar-item ${activePageId === "feedback" ? "active" : ""}`}
            onClick={() => handleNav("feedback", "Feedback", "feedback")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><FeedbackIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Feedback</span>}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};
