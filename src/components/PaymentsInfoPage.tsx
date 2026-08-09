import React from "react";

export const PaymentsInfoPage: React.FC<{
  onNavigateToPolicy?: () => void;
  onNavigateToTransactions?: () => void;
}> = ({ onNavigateToPolicy, onNavigateToTransactions }) => {
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
          <div className="topbar-avatar" title="Google Account">
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
        {/* Pink Alert Banner */}
        <div className="policy-banner">
          <div className="policy-banner-left">
            <div className="banner-pager">
              <button className="pager-btn">&lt;</button>
              <span className="pager-text">1 / 2</span>
              <button className="pager-btn">&gt;</button>
            </div>
            <div className="banner-alert-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ color: "#D93025", fontSize: "20px" }}>
                error_outline
              </i>
            </div>
            <span className="banner-text">
              The number of ads you can show has been limited for one or more of your AdSense products. For more information, go to the Policy Center.
            </span>
          </div>
          <button className="banner-action-btn" onClick={onNavigateToPolicy}>
            Policy Center
          </button>
        </div>

        {/* Divider line below Policy Banner */}
        <div className="policy-banner-divider" />

        {/* Main Body Below Divider */}
        <div className="payments-main-body">
          {/* Payments Account Header */}
          <div className="payments-account-header">
            <span className="payments-account-sublabel">PAYMENTS ACCOUNT</span>
            <span className="payments-account-title">AdSense (United Kingdom)</span>
            <h2 className="payments-section-heading">Payments</h2>
          </div>

          {/* Red Warning Alert Box */}
          <div className="red-alert-card">
            <div className="red-alert-left">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: "24px" }}>
                warning
              </i>
              <span className="red-alert-text">To receive payouts, please choose a valid payment method.</span>
            </div>
            <button className="red-alert-update-btn">Update</button>
          </div>

          {/* Your Earnings Card */}
          <div className="earnings-card">
            <div className="earnings-card-top">
              <div className="earnings-card-info">
                <h3 className="earnings-title">Your earnings</h3>
                <p className="earnings-subtitle">
                  Paid monthly if the total is at least £60.00 (your payout threshold)
                </p>
              </div>
              <span className="earnings-amount">£135.12</span>
            </div>

          {/* Progress bar section (62% width matching screenshot) */}
          <div className="earnings-progress-section">
            <div className="earnings-progress-track">
              <div className="earnings-progress-fill" style={{ width: "100%" }} />
            </div>

            <div className="earnings-card-footer-text">
              <span>You've reached 100% of your payment threshold</span>
              <span>Payment threshold: £60.00</span>
            </div>
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
                    <span className="transaction-amount">£135.12</span>
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
                    <span className="transaction-amount">£135.12</span>
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
                    <span className="transaction-amount">£1.84</span>
                  </div>
                </div>
              </div>
              <div className="payments-card-footer-action">
                <button
                  className="card-footer-link-btn"
                  onClick={onNavigateToTransactions}
                >
                  View transactions
                </button>
              </div>
            </div>

            {/* How You Get Paid Card */}
            <div className="payments-card">
              <div className="payments-card-body">
                <h3 className="payments-card-title">How you get paid</h3>
                <div className="how-paid-content">
                  <div className="dark-card-icon-wrap">
                    <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "28px", color: "#FFFFFF" }}>
                      add_card
                    </i>
                  </div>
                  <span className="how-paid-text">
                    Add a payment method to receive your earnings
                  </span>
                </div>
              </div>
              <div className="payments-card-footer-action">
                <button className="card-footer-link-btn">Add payment method</button>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="payments-card settings-card">
            <div className="payments-card-body">
              <h3 className="payments-card-title">Settings</h3>
              <div className="settings-details-list">
                <p className="setting-line bold-text">AdSense pub-2229538054781862</p>
                <p className="setting-line name-text">ABAYOMI ADEMOLA ALLI-BALOGUN</p>
                <a href="#user" className="setting-user-link" onClick={(e) => e.preventDefault()}>
                  1 user
                </a>
              </div>
            </div>
            <div className="payments-card-footer-action">
              <button className="card-footer-link-btn">Manage settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
