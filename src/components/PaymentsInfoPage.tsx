import React, { useState, useEffect } from "react";
import { useBrowser } from "../context/BrowserContext";
import {
  EarningsConfigModal,
  EarningsConfigData,
  DEFAULT_EARNINGS_CONFIG,
} from "./EarningsConfigModal";

const EARNINGS_STORAGE_KEY = "adsense_earnings_config";

export const PaymentsInfoPage: React.FC<{
  onNavigateToPolicy?: () => void;
  onNavigateToTransactions?: () => void;
}> = ({ onNavigateToTransactions }) => {
  const { formatCurrency, setIsSettingsModalOpen } = useBrowser();

  const [earningsConfig, setEarningsConfig] = useState<EarningsConfigData>(() => {
    try {
      const saved = localStorage.getItem(EARNINGS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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

  const progressPercent = earningsConfig.isCustomProgress
    ? earningsConfig.customProgressPercent
    : earningsConfig.threshold > 0
    ? Math.min(100, Math.floor((earningsConfig.currentEarnings / earningsConfig.threshold) * 100))
    : 0;

  return (
    <div className="payments-page-container">
      {/* Top Header Bar */}
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

      {/* Main Content Viewport */}
      <div className="payments-page-content">
        {/* Main Body */}
        <div className="payments-main-body">
          {/* Payments Account Header */}
          <div className="payments-account-header">
            <span className="payments-account-sublabel">PAYMENTS ACCOUNT</span>
            <span className="payments-account-title">AdSense ({earningsConfig.countryName || "United Kingdom"})</span>
            <h2 className="payments-section-heading">Payments</h2>
          </div>

          {/* Your Earnings Card (Double Click to Configure) */}
          <div
            className="earnings-card"
            onDoubleClick={() => setIsConfigModalOpen(true)}
            title="Double-click to configure Your Earnings parameters"
            style={{ cursor: "pointer", userSelect: "none" }}
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
            {/* Transactions Card */}
            <div className="payments-card">
              <div className="payments-card-body">
                <h3 className="payments-card-title">Transactions</h3>
                <div className="transactions-list">
                  <div className="transaction-item">
                    <a
                      href="#aug"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.();
                      }}
                    >
                      Aug 1 - 8, 2026
                    </a>
                    <span className="transaction-amount">{formatCurrency("135.12")}</span>
                  </div>
                  <div className="transaction-item">
                    <a
                      href="#jul"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.();
                      }}
                    >
                      Jul 1 - 31, 2026
                    </a>
                    <span className="transaction-amount">{formatCurrency("135.12")}</span>
                  </div>
                  <div className="transaction-item">
                    <a
                      href="#jun"
                      className="transaction-date-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToTransactions?.();
                      }}
                    >
                      Jun 1 - 30, 2026
                    </a>
                    <span className="transaction-amount">{formatCurrency("60.00")}</span>
                  </div>
                </div>
                <div className="payments-card-actions">
                  <a
                    href="#view-transactions"
                    className="card-text-link"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToTransactions?.();
                    }}
                  >
                    View transactions
                  </a>
                </div>
              </div>
            </div>

            {/* How You Get Paid Card */}
            <div className="payments-card">
              <div className="payments-card-body">
                <h3 className="payments-card-title">How you get paid</h3>
                <p className="payments-card-desc">
                  You'll need to add a payment method before you can collect your earnings.
                </p>
                <div className="payments-card-actions margin-top-large">
                  <button className="btn-add-payment-method">
                    <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "18px", marginRight: "6px" }}>
                      add_card
                    </i>
                    Add payment method
                  </button>
                </div>
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
