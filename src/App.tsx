import React, { useState, useEffect } from "react";
import { BrowserProvider, useBrowser } from "./context/BrowserContext";
import { ChromeHeader } from "./components/ChromeHeader";
import { Sidebar } from "./components/Sidebar";
import { SitesPage } from "./components/SitesPage";
import { PaymentsInfoPage } from "./components/PaymentsInfoPage";
import { TransactionsServicePage } from "./components/TransactionsServicePage";
import "./ChromeTheme.css";

const PageViewport: React.FC = () => {
  const { currentEntry, refreshKey, isRefreshing, isNavigatingLoading, navigateTo } = useBrowser();
  const [loadTime, setLoadTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    setLoadTime(new Date().toLocaleTimeString());
  }, [currentEntry.pageId, refreshKey]);

  if (isNavigatingLoading) {
    return (
      <div className="viewport-content">
        <div className="adsense-topbar">
          <h1 className="adsense-topbar-title">
            {currentEntry.pageId === "payments-info" || currentEntry.pageId === "transactions-service"
              ? "Payments info"
              : "Sites"}
          </h1>
          <div className="adsense-topbar-right">
            <button className="topbar-icon-btn" title="Help">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px", color: "#5F6368" }}>
                help_outline
              </i>
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px", color: "#5F6368" }}>
                notifications_none
              </i>
            </button>
            <div className="topbar-avatar" title="Google Account">
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#1A73E8" />
                <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
                <circle cx="16" cy="11" r="4.5" fill="#FFF" />
              </svg>
            </div>
          </div>
        </div>

        {/* Centered Circular Spinner Below Divider */}
        <div className="center-page-spinner-wrap">
          <svg className="google-material-spinner" width="30" height="30" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke="#1A73E8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="48, 90"
            />
          </svg>
        </div>
      </div>
    );
  }

  const pageId = currentEntry.pageId || "sites-list";

  if (pageId === "sites-list") {
    return (
      <div className="viewport-content" key={refreshKey}>
        <SitesPage
          onNavigateToDetail={(siteUrl) =>
            navigateTo({
              title: `Site Detail: ${siteUrl} – Google AdSense`,
              url: `https://adsense.google.com/adsense/u/0/pub-2229538054781862/sites/detail/${siteUrl}`,
              pageId: "site-detail",
            })
          }
          onNavigateToPolicy={() =>
            navigateTo({
              title: "Policy center – Google AdSense",
              url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/policy/overview",
              pageId: "policy",
            })
          }
        />
      </div>
    );
  }

  if (pageId === "payments-info") {
    return (
      <div className="viewport-content" key={refreshKey}>
        <PaymentsInfoPage
          onNavigateToPolicy={() =>
            navigateTo({
              title: "Policy center – Google AdSense",
              url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/policy/overview",
              pageId: "policy",
            })
          }
          onNavigateToTransactions={() =>
            navigateTo({
              title: "Payments info – Payments – Google AdSense",
              url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/payments/?place=TRANSACTIONS_SERVICE",
              pageId: "transactions-service",
            })
          }
        />
      </div>
    );
  }

  if (pageId === "transactions-service") {
    return (
      <div className="viewport-content" key={refreshKey}>
        <TransactionsServicePage
          onNavigateToPolicy={() =>
            navigateTo({
              title: "Policy center – Google AdSense",
              url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/policy/overview",
              pageId: "policy",
            })
          }
          onNavigateBackToPayments={() =>
            navigateTo({
              title: "Payments info – Google AdSense",
              url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/payments",
              pageId: "payments-info",
            })
          }
        />
      </div>
    );
  }

  return (
    <div className="viewport-content" key={refreshKey}>
      <div style={{ padding: "32px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Page Top Status Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1a73e8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Google AdSense Console
            </span>
            <h1 style={{ fontSize: "24px", color: "#202124", fontWeight: 400, marginTop: "4px" }}>
              {currentEntry.title.replace(" – Google AdSense", "")}
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "12px",
                color: isRefreshing ? "#1a73e8" : "#5f6368",
                backgroundColor: isRefreshing ? "#e8f0fe" : "#f1f3f4",
                padding: "6px 12px",
                borderRadius: "12px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              {isRefreshing ? "↻ Reloading data..." : `Last updated at ${loadTime}`}
            </span>
          </div>
        </div>

        {/* Dynamic Page Rendering */}
        {pageId === "payments-info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Balance Card */}
            <div
              style={{
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #dadce0",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 2px rgba(60,64,67,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", color: "#202124", fontWeight: 500 }}>Your earnings</h2>
                <span style={{ fontSize: "13px", color: "#1a73e8", fontWeight: 500, cursor: "pointer" }}>View transactions →</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "36px", fontWeight: 400, color: "#202124" }}>$1,428.50</span>
                <span style={{ fontSize: "14px", color: "#5f6368" }}>Paid monthly if threshold ($100.00) is reached</span>
              </div>
              {/* Progress bar */}
              <div style={{ width: "100%", height: "8px", backgroundColor: "#e8f0fe", borderRadius: "4px", marginTop: "16px", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "#1a73e8", borderRadius: "4px" }} />
              </div>
            </div>

            {/* How you get paid */}
            <div
              style={{
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #dadce0",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 2px rgba(60,64,67,0.05)",
              }}
            >
              <h2 style={{ fontSize: "18px", color: "#202124", fontWeight: 500, marginBottom: "12px" }}>How you get paid</h2>
              <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "16px" }}>
                Primary payment method: Wire transfer to bank account (•••• 8892)
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #dadce0",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#1a73e8",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Manage payment methods
              </button>
            </div>
          </div>
        )}

        {pageId === "verification-check" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", fontWeight: 500, marginBottom: "16px" }}>Identity verification</h2>
            <div style={{ padding: "16px", backgroundColor: "#e6f4ea", borderRadius: "8px", color: "#137333", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
              <span>✓</span> Identity check completed successfully
            </div>
          </div>
        )}

        {pageId === "home" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ padding: "24px", borderRadius: "8px", border: "1px solid #dadce0", backgroundColor: "#ffffff" }}>
              <h3 style={{ fontSize: "14px", color: "#5f6368", marginBottom: "8px" }}>Estimated earnings (Today)</h3>
              <p style={{ fontSize: "32px", fontWeight: 400, color: "#1a73e8" }}>$42.80</p>
            </div>
            <div style={{ padding: "24px", borderRadius: "8px", border: "1px solid #dadce0", backgroundColor: "#ffffff" }}>
              <h3 style={{ fontSize: "14px", color: "#5f6368", marginBottom: "8px" }}>Page views</h3>
              <p style={{ fontSize: "32px", fontWeight: 400, color: "#202124" }}>12,450</p>
            </div>
          </div>
        )}

        {pageId === "sites-list" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #dadce0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", color: "#202124", fontWeight: 500 }}>Sites (3 active)</h2>
              <button style={{ padding: "8px 16px", backgroundColor: "#1a73e8", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                + Add site
              </button>
            </div>
            <div
              onClick={() =>
                navigateTo({
                  title: "Site Detail: example.com – Google AdSense",
                  url: "https://adsense.google.com/adsense/u/0/pub-2229538054781862/sites/detail/example.com",
                  pageId: "site-detail",
                })
              }
              style={{ padding: "16px", border: "1px solid #eee", borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ fontWeight: 500, color: "#1a73e8" }}>example.com</span>
              <span style={{ color: "#1e8e3e", fontSize: "13px" }}>Ready</span>
            </div>
          </div>
        )}

        {pageId === "site-detail" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Site Details: example.com</h2>
            <p style={{ color: "#5f6368", fontSize: "14px" }}>Auto ads status: ON • Anchor ads: Enabled</p>
          </div>
        )}

        {pageId === "reports" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Performance Reports</h2>
            <p style={{ color: "#5f6368", fontSize: "14px" }}>RPM: $4.25 • CTR: 2.1% • Impressions: 38,200</p>
          </div>
        )}

        {pageId === "settings" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Account Information</h2>
            <p style={{ color: "#5f6368", fontSize: "14px" }}>Publisher ID: pub-2229538054781862 • Time zone: (UTC+08:00) Beijing</p>
          </div>
        )}

        {/* Informational Footer Tip */}
        <div style={{ marginTop: "32px", padding: "14px 18px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <p style={{ fontSize: "13px", color: "#5f6368" }}>
            💡 <strong>Sidebar & Header Sync:</strong> Click any sidebar menu item on the left to navigate. Notice how the top address bar URL, tab title, and Back/Forward history update in real time!
          </p>
        </div>
      </div>
    </div>
  );
};

import { GlobalSettingsModal } from "./components/GlobalSettingsModal";

export function App() {
  return (
    <>

      <ChromeHeader />
      <main className="chrome-viewport">
        <Sidebar />
        <PageViewport />
      </main>

      {/* Global Preferences Modal */}
      <GlobalSettingsModal />
    </>
  );
}

export function AppContainer() {
  return (
    <BrowserProvider>
      <App />
    </BrowserProvider>
  );
}

export default AppContainer;
