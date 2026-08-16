import React, { useState, useEffect, useMemo } from "react";
import { useBrowser } from "../context/BrowserContext";
import {
  EarningsConfigModal,
  EarningsConfigData,
  DEFAULT_EARNINGS_CONFIG,
} from "./EarningsConfigModal";

const EARNINGS_STORAGE_KEY = "adsense_earnings_config";

export const PaymentsInfoPage: React.FC<{
  onNavigateToPolicy?: () => void;
  onNavigateToTransactions?: (hash?: string) => void;
}> = ({ onNavigateToTransactions }) => {
  const { formatCurrency, setIsSettingsModalOpen, productMode } = useBrowser();

  const [earningsConfig, setEarningsConfig] = useState<EarningsConfigData>(() => {
    try {
      const saved = localStorage.getItem(EARNINGS_STORAGE_KEY);
      if (saved) {
        return {
          ...DEFAULT_EARNINGS_CONFIG,
          ...JSON.parse(saved),
        };
      }
    } catch (err) {
      console.error("Error loading earnings config", err);
    }
    return DEFAULT_EARNINGS_CONFIG;
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(earningsConfig));
    } catch (err) {
      console.error("Error saving earnings config", err);
    }
  }, [earningsConfig]);

  const dateRanges = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    // Row 1: Current month (e.g. Sep 1 – 20, 2026 or Aug 1 – 9, 2026)
    const m1 = now.toLocaleDateString("en-US", { month: "short" });
    const row1Text = `${m1} 1\u2009\u2013\u2009${day}, ${year}`;

    // Row 2: 1 month ago (e.g. Aug 1 – 31, 2026 or Jul 1 – 31, 2026)
    const d2 = new Date(year, month - 1, 1);
    const m2 = d2.toLocaleDateString("en-US", { month: "short" });
    const y2 = d2.getFullYear();
    const lastDay2 = new Date(year, month, 0).getDate();
    const row2Text = `${m2} 1\u2009\u2013\u2009${lastDay2}, ${y2}`;

    // Row 3: 2 months ago (e.g. Jul 1 – 31, 2026 or Jun 1 – 30, 2026)
    const d3 = new Date(year, month - 2, 1);
    const m3 = d3.toLocaleDateString("en-US", { month: "short" });
    const y3 = d3.getFullYear();
    const lastDay3 = new Date(year, month - 1, 0).getDate();
    const row3Text = `${m3} 1\u2009\u2013\u2009${lastDay3}, ${y3}`;

    return { row1Text, row2Text, row3Text };
  }, []);

  const progressPercent =
    earningsConfig.threshold > 0
      ? Math.min(100, Math.floor((earningsConfig.currentEarnings / earningsConfig.threshold) * 100))
      : 0;

  return (
    <div className="payments-page-container">
      {/* Top Header Bar (Only in AdSense Mode) */}
      {productMode === "adsense" && (
        <div className="adsense-topbar">
          <h1 className="adsense-topbar-title">Payments info</h1>
          <div className="adsense-topbar-right">
            <button className="topbar-icon-btn" title="Help">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5F6368" }}>
                help_outline
              </i>
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5F6368" }}>
                notifications_none
              </i>
            </button>
            <div
              className="topbar-avatar"
              title="Google Account & Global Settings"
              onClick={() => setIsSettingsModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#1A73E8" />
                <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
                <circle cx="16" cy="11" r="4.5" fill="#FFF" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="payments-page-content">
        {/* Main Body */}
        <div className="payments-main-body">
          {/* Payments Account Header */}
          {productMode === "adsense" ? (
            <div className="payments-account-header">
              <span className="payments-account-sublabel">PAYMENTS ACCOUNT</span>
              <span className="payments-account-title">AdSense ({earningsConfig.countryName || "United Kingdom"})</span>
              <h2 className="payments-section-heading">Payments</h2>
            </div>
          ) : (
            <div style={{ height: "24px" }} />
          )}

          {/* Your Earnings Card (Double Click to Configure) */}
          <div
            className="earnings-card"
            onDoubleClick={() => setIsConfigModalOpen(true)}
            title="Double-click to configure parameters"
            style={{ cursor: "pointer" }}
          >
            <div className="earnings-card-top">
              <div className="earnings-card-info">
                <h3 className="earnings-title">Your earnings</h3>
                <p className="earnings-subtitle">
                  Paid monthly if the total is at least {formatCurrency(earningsConfig.threshold)} (your payout threshold)
                </p>
              </div>
              <span className="earnings-amount">{formatCurrency(earningsConfig.currentEarnings)}</span>
            </div>

            {/* Progress bar section */}
            <div className="earnings-progress-section">
              <div className="earnings-progress-track">
                <div className="earnings-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="earnings-card-footer-text">
                <span>You've reached {progressPercent}% of your payment threshold</span>
                <span>Payment threshold: {formatCurrency(earningsConfig.threshold)}</span>
              </div>
            </div>

            {/* Last Payment Line with SVG Calendar Icon */}
            <div
              className="last-payment-line"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "14px",
                paddingTop: "10px",
                color: "#5f6368",
                fontSize: "12.5px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368" style={{ flexShrink: 0 }}>
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
              <span>
                Your last payment was issued on {earningsConfig.lastPaymentDate} for{" "}
                {formatCurrency(earningsConfig.lastPaymentAmount)}.
              </span>
            </div>
          </div>

          {/* Two Column Grid: Transactions & How You Get Paid */}
          <div className="payments-two-col-grid">
            {/* Card 1: Transactions Card */}
            <div
              className="payments-card"
              onDoubleClick={() => setIsConfigModalOpen(true)}
              title="Double-click to edit parameters"
              style={{ cursor: "pointer" }}
            >
              <div className="payments-card-body">
                <h3 className="payments-card-title">Transactions</h3>
                <div className="transactions-list">
                  <div className="transaction-item">
                    <a
                      href="#row1"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.("#row1");
                      }}
                    >
                      {dateRanges.row1Text}
                    </a>
                    <span className="transaction-amount">{formatCurrency(earningsConfig.augAmount ?? 0.42)}</span>
                  </div>
                  <div className="transaction-item">
                    <a
                      href="#row2"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.("#row2");
                      }}
                    >
                      {dateRanges.row2Text}
                    </a>
                    <span className="transaction-amount">{formatCurrency(earningsConfig.julAmount ?? 0.42)}</span>
                  </div>
                  <div className="transaction-item">
                    <a
                      href="#row3"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.("#row3");
                      }}
                    >
                      {dateRanges.row3Text}
                    </a>
                    <span className="transaction-amount">{formatCurrency(earningsConfig.junAmount ?? 392.47)}</span>
                  </div>
                </div>
              </div>
              <div className="payments-card-footer-action">
                <button
                  className="card-footer-link-btn"
                  onClick={() => onNavigateToTransactions?.("#all")}
                >
                  View transactions
                </button>
              </div>
            </div>

            {/* Card 2: How You Get Paid Card */}
            <div
              className="payments-card"
              onDoubleClick={() => setIsConfigModalOpen(true)}
              title="Double-click to edit parameters"
              style={{ cursor: "pointer" }}
            >
              <div className="payments-card-body">
                <h3 className="payments-card-title">How you get paid</h3>
                <div className="how-paid-flex-row" style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px", marginBottom: "8px" }}>
                  <div
                    className="blue-bank-icon-box"
                    style={{
                      width: "88px",
                      height: "58px",
                      backgroundColor: "#d3e3fd",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="#041e49">
                      <path d="M4 10h2v7H4zm5 0h2v7H9zm6 0h2v7h-2zm5 0h2v7h-2zM2 22h20v-3H2v3zm10-20L2 6v2h20V6l-10-4z" />
                      <circle cx="18" cy="15" r="3.2" fill="#041e49" stroke="#d3e3fd" strokeWidth="0.8" />
                      <text x="18" y="16.8" fontSize="3.8" fill="#d3e3fd" textAnchor="middle" fontWeight="bold">
                        $
                      </text>
                    </svg>
                  </div>
                  <div className="how-paid-info-text">
                    <div style={{ fontSize: "11px", color: "#3c4043", fontWeight: 500, letterSpacing: "0.2px" }}>
                      {earningsConfig.bankMasked || "DE••\u2009••••\u2009••••\u2009••••\u2009••07\u200949"}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#5f6368", textTransform: "uppercase", marginTop: "3px", letterSpacing: "0.2px" }}>
                      {earningsConfig.payeeName || "EMMANUEL DELLBRÜGGER"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="payments-card-footer-action">
                <button className="card-footer-link-btn">
                  Manage payment methods
                </button>
              </div>
            </div>

            {/* Card 3: Settings Card */}
            <div
              className="payments-card"
              onDoubleClick={() => setIsConfigModalOpen(true)}
              title="Double-click to edit parameters"
              style={{ cursor: "pointer" }}
            >
              <div className="payments-card-body">
                <h3 className="payments-card-title">Settings</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ fontSize: "11px", color: "#5f6368" }}>
                    AdSense {earningsConfig.pubId || "pub-8666469182451238"}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#202124", fontWeight: 500 }}>
                    {earningsConfig.payeeName || "EMMANUEL DELLBRÜGGER"}
                  </div>
                  <div>
                    <a href="#user" style={{ fontSize: "11px", color: "#1a73e8", textDecoration: "none" }}>
                      1 user
                    </a>
                  </div>
                </div>
              </div>
              <div className="payments-card-footer-action">
                <button className="card-footer-link-btn">
                  Manage settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Parameter Configuration Modal */}
      <EarningsConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={earningsConfig}
        onSaveConfig={(newCfg) => setEarningsConfig(newCfg)}
      />
    </div>
  );
};
