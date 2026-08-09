import React, { useState } from "react";

export const TransactionsServicePage: React.FC<{
  onNavigateToPolicy?: () => void;
  onNavigateBackToPayments?: () => void;
}> = ({ onNavigateToPolicy, onNavigateBackToPayments }) => {
  const [expandedMonth, setExpandedMonth] = useState<string>("aug");

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
          {/* Header & Breadcrumb */}
          <div className="transactions-header-row">
            <div className="payments-account-header">
              <span className="payments-account-sublabel">PAYMENTS ACCOUNT</span>
              <span className="payments-account-title">AdSense (United Kingdom)</span>
              <div className="breadcrumb-title-row">
                <span className="breadcrumb-link" onClick={onNavigateBackToPayments}>
                  Payments
                </span>
                <span className="breadcrumb-separator">&gt;</span>
                <h2 className="breadcrumb-current">Transactions</h2>
              </div>
            </div>

            {/* Filter Controls Row (Right Side) */}
            <div className="transactions-filter-controls">
              <div className="trans-select-wrap">
                <select defaultValue="detailed">
                  <option value="detailed">Detailed transaction view</option>
                  <option value="summary">Summary view</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>

              <div className="trans-select-wrap">
                <select defaultValue="all">
                  <option value="all">All transactions</option>
                  <option value="earnings">Earnings</option>
                  <option value="payments">Payments</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>

              <div className="trans-select-wrap calendar-select">
                <i className="material-icon-i material-icons-extended" style={{ fontSize: "16px", color: "#5f6368", marginRight: "4px" }}>
                  calendar_today
                </i>
                <select defaultValue="3months">
                  <option value="3months">Last 3 months</option>
                  <option value="6months">Last 6 months</option>
                  <option value="year">This year</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
          </div>

          {/* Month Blocks Container */}
          <div className="transactions-period-blocks">
            {/* Block 1: Aug 1 - 8, 2026 */}
            {expandedMonth === "aug" ? (
              <div className="period-block expanded">
                <div className="period-block-header">
                  <h3 className="period-title">Aug 1 – 8, 2026</h3>
                </div>
                <div className="period-balance-line align-right">
                  <span className="balance-text">Ending balance: £135.12</span>
                </div>

                {/* Data Table */}
                <div className="period-table-wrap">
                  <table className="period-table">
                    <thead>
                      <tr>
                        <th className="col-date">Date</th>
                        <th className="col-desc">Description</th>
                        <th className="col-amount align-right">Amount (GBP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="empty-period-cell">
                          You don't have any transactions for this billing period
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="period-balance-line align-right starting-line">
                  <span className="balance-text">Starting balance: £135.12</span>
                </div>
              </div>
            ) : (
              <div className="period-block collapsed" onClick={() => setExpandedMonth("aug")}>
                <span className="period-title-collapsed">Aug 1 – 8, 2026</span>
                <span className="balance-text-collapsed">Ending balance: £135.12</span>
              </div>
            )}

            {/* Block 2: Jul 1 - 31, 2026 */}
            {expandedMonth === "jul" ? (
              <div className="period-block expanded">
                <div className="period-block-header">
                  <h3 className="period-title">Jul 1 – 31, 2026</h3>
                </div>
                <div className="period-balance-line align-right">
                  <span className="balance-text">Ending balance: £135.12</span>
                </div>

                <div className="period-table-wrap">
                  <table className="period-table">
                    <thead>
                      <tr>
                        <th className="col-date">Date</th>
                        <th className="col-desc">Description</th>
                        <th className="col-amount align-right">Amount (GBP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="empty-period-cell">
                          You don't have any transactions for this billing period
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="period-balance-line align-right starting-line">
                  <span className="balance-text">Starting balance: £135.12</span>
                </div>
              </div>
            ) : (
              <div className="period-block collapsed" onClick={() => setExpandedMonth("jul")}>
                <span className="period-title-collapsed">Jul 1 – 31, 2026</span>
                <span className="balance-text-collapsed">Ending balance: £135.12</span>
              </div>
            )}

            {/* Block 3: Jun 1 - 30, 2026 */}
            {expandedMonth === "jun" ? (
              <div className="period-block expanded">
                <div className="period-block-header">
                  <h3 className="period-title">Jun 1 – 30, 2026</h3>
                </div>
                <div className="period-balance-line align-right">
                  <span className="balance-text">Ending balance: £1.84</span>
                </div>

                <div className="period-table-wrap">
                  <table className="period-table">
                    <thead>
                      <tr>
                        <th className="col-date">Date</th>
                        <th className="col-desc">Description</th>
                        <th className="col-amount align-right">Amount (GBP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="empty-period-cell">
                          You don't have any transactions for this billing period
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="period-balance-line align-right starting-line">
                  <span className="balance-text">Starting balance: £0.00</span>
                </div>
              </div>
            ) : (
              <div className="period-block collapsed" onClick={() => setExpandedMonth("jun")}>
                <span className="period-title-collapsed">Jun 1 – 30, 2026</span>
                <span className="balance-text-collapsed">Ending balance: £1.84</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
