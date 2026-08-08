import React, { useState, useEffect } from "react";
import { BrowserProvider, useBrowser } from "./context/BrowserContext";
import { ChromeHeader } from "./components/ChromeHeader";
import "./ChromeTheme.css";

const PageViewport: React.FC = () => {
  const { currentEntry, refreshKey, isRefreshing, navigateTo } = useBrowser();
  const [loadTime, setLoadTime] = useState<string>(new Date().toLocaleTimeString());

  // Update load time whenever page changes or refresh is triggered
  useEffect(() => {
    setLoadTime(new Date().toLocaleTimeString());
  }, [currentEntry.pageId, refreshKey]);

  const pageId = currentEntry.pageId || "sites-list";

  return (
    <main className="chrome-viewport" key={refreshKey}>
      <div style={{ padding: "32px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Page Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1a73e8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Google AdSense Console
            </span>
            <h1 style={{ fontSize: "24px", color: "#202124", fontWeight: 500, marginTop: "4px" }}>
              {currentEntry.title}
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "12px",
                color: isRefreshing ? "#1a73e8" : "#5f6368",
                backgroundColor: isRefreshing ? "#e8f0fe" : "#f1f3f4",
                padding: "4px 10px",
                borderRadius: "12px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              {isRefreshing ? "↻ Reloading viewport..." : `Updated at ${loadTime}`}
            </span>
          </div>
        </div>

        {/* Dynamic Page Views */}
        {pageId === "sites-list" && (
          <div>
            <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "24px" }}>
              Overview of your active monetized domains and AdSense status.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div
                onClick={() =>
                  navigateTo({
                    title: "Site Detail: myblog.com – AdSense",
                    url: "adsense.google.com/adsense/u/0/pub-222938054781862/sites/detail/myblog.com",
                    pageId: "site-detail",
                  })
                }
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "transform 0.15s ease, shadow 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "16px", color: "#1a73e8", fontWeight: 600 }}>myblog.com</h3>
                  <span style={{ fontSize: "12px", color: "#1e8e3e", backgroundColor: "#e6f4ea", padding: "2px 8px", borderRadius: "10px", fontWeight: 500 }}>
                    Ready
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#5f6368" }}>Auto ads enabled • 3 Ad units active</p>
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#1a73e8", fontWeight: 500 }}>
                  View site analytics →
                </div>
              </div>

              <div
                onClick={() =>
                  navigateTo({
                    title: "Earnings Overview – AdSense",
                    url: "adsense.google.com/adsense/u/0/pub-222938054781862/reports/earnings",
                    pageId: "earnings",
                  })
                }
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "16px", color: "#202124", fontWeight: 600 }}>Earnings Report</h3>
                  <span style={{ fontSize: "12px", color: "#1a73e8", backgroundColor: "#e8f0fe", padding: "2px 8px", borderRadius: "10px", fontWeight: 500 }}>
                    +15.2%
                  </span>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 600, color: "#1a73e8" }}>$1,842.30</p>
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#1a73e8", fontWeight: 500 }}>
                  Open detailed reports →
                </div>
              </div>

              <div
                onClick={() =>
                  navigateTo({
                    title: "Account Settings – AdSense",
                    url: "adsense.google.com/adsense/u/0/pub-222938054781862/settings/account",
                    pageId: "settings",
                  })
                }
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "16px", color: "#202124", fontWeight: 600 }}>Account Settings</h3>
                </div>
                <p style={{ fontSize: "13px", color: "#5f6368" }}>Publisher ID: pub-222938054781862</p>
                <div style={{ marginTop: "16px", fontSize: "13px", color: "#1a73e8", fontWeight: 500 }}>
                  Manage preferences →
                </div>
              </div>
            </div>
          </div>
        )}

        {pageId === "site-detail" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Domain: myblog.com</h2>
            <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "20px" }}>
              Detailed ad performance and ad placement settings for myblog.com.
            </p>
            <div style={{ padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#3c4043" }}>✓ Ads.txt Status: Authorized</p>
              <p style={{ fontSize: "13px", color: "#3c4043", marginTop: "4px" }}>✓ Approval Status: Getting ads ready</p>
            </div>
            <button
              onClick={() =>
                navigateTo({
                  title: "Sites – Google AdSense",
                  url: "adsense.google.com/adsense/u/0/pub-222938054781862/sites/list",
                  pageId: "sites-list",
                })
              }
              style={{
                padding: "8px 16px",
                backgroundColor: "#f1f3f4",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#3c4043",
                cursor: "pointer",
              }}
            >
              ← Back to Sites List
            </button>
          </div>
        )}

        {pageId === "earnings" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Earnings & Performance Metrics</h2>
            <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "20px" }}>
              This month's revenue breakdown and RPM statistics.
            </p>
            <div style={{ padding: "20px", backgroundColor: "#e8f0fe", borderRadius: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", color: "#1967d2" }}>Total Earnings</span>
              <p style={{ fontSize: "32px", fontWeight: 700, color: "#1967d2", marginTop: "4px" }}>$1,842.30</p>
            </div>
          </div>
        )}

        {pageId === "settings" && (
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #dadce0" }}>
            <h2 style={{ fontSize: "18px", color: "#202124", marginBottom: "12px" }}>Account Preferences</h2>
            <p style={{ color: "#5f6368", fontSize: "14px" }}>
              Manage tax information, payment methods, and user access.
            </p>
          </div>
        )}

        {pageId === "new-tab" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2 style={{ fontSize: "28px", color: "#202124", fontWeight: 400, marginBottom: "16px" }}>New Tab</h2>
            <p style={{ color: "#5f6368", fontSize: "15px", marginBottom: "28px" }}>
              Select a quick shortcut below to navigate:
            </p>
            <button
              onClick={() =>
                navigateTo({
                  title: "Sites – Google AdSense",
                  url: "adsense.google.com/adsense/u/0/pub-222938054781862/sites/list",
                  pageId: "sites-list",
                })
              }
              style={{
                padding: "10px 24px",
                backgroundColor: "#1a73e8",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              Open Google AdSense Dashboard
            </button>
          </div>
        )}

        {/* Tip Banner */}
        <div style={{ marginTop: "32px", padding: "12px 16px", backgroundColor: "#fff8e1", borderRadius: "8px", border: "1px solid #ffe082" }}>
          <p style={{ fontSize: "13px", color: "#795548", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>💡</span>
            <span>
              <strong>Try the Header Controls:</strong> Click any card above to navigate. Use the <strong>← Back</strong> and <strong>→ Forward</strong> buttons in the top beige Chrome header to navigate history, or click <strong>↻ Reload</strong> to refresh the content area!
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export function App() {
  return (
    <BrowserProvider>
      <ChromeHeader />
      <PageViewport />
    </BrowserProvider>
  );
}

export default App;
