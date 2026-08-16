import React, { useState, useEffect, useMemo } from "react";
import { useBrowser } from "../context/BrowserContext";
import {
  EarningsConfigData,
  TransactionItem,
  DEFAULT_EARNINGS_CONFIG,
} from "./EarningsConfigModal";
import {
  TransactionsConfigModal,
  computeMonthDateInfo,
} from "./TransactionsConfigModal";

const EARNINGS_STORAGE_KEY = "adsense_earnings_config";

export const TransactionsServicePage: React.FC<{
  onNavigateToPolicy?: () => void;
  onNavigateBackToPayments?: () => void;
}> = ({ onNavigateBackToPayments }) => {
  const { currentEntry, formatCurrency, setIsSettingsModalOpen, currencySymbol, productMode } = useBrowser();

  // Financial Config Persistence
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

  // Dynamic Expansion States
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>(() => {
    const target = currentEntry.targetMonth || currentEntry.url || "";
    const res: Record<string, boolean> = {};
    for (let i = 1; i <= 24; i++) {
      res[`row${i}`] = true;
    }
    if (target === "row1" || target.includes("#row1") || target.includes("#aug")) {
      res.row1 = true;
      res.row2 = false;
      res.row3 = false;
    } else if (target === "row2" || target.includes("#row2") || target.includes("#jul")) {
      res.row1 = false;
      res.row2 = true;
      res.row3 = false;
    } else if (target === "row3" || target.includes("#row3") || target.includes("#jun")) {
      res.row1 = false;
      res.row2 = false;
      res.row3 = true;
    }
    return res;
  });

  useEffect(() => {
    const target = currentEntry.targetMonth || currentEntry.url || "";
    const res: Record<string, boolean> = {};
    for (let i = 1; i <= 24; i++) {
      res[`row${i}`] = true;
    }
    if (target === "row1" || target.includes("#row1") || target.includes("#aug")) {
      res.row1 = true;
      res.row2 = false;
      res.row3 = false;
    } else if (target === "row2" || target.includes("#row2") || target.includes("#jul")) {
      res.row1 = false;
      res.row2 = true;
      res.row3 = false;
    } else if (target === "row3" || target.includes("#row3") || target.includes("#jun")) {
      res.row1 = false;
      res.row2 = false;
      res.row3 = true;
    }
    setExpandedBlocks(res);
  }, [currentEntry.targetMonth, currentEntry.url]);

  // Automatic Mathematical Balance Calculation for N Months
  const balances = useMemo(() => {
    let monthsData = earningsConfig.monthsData;

    // Fallback if monthsData is empty or undefined
    if (!monthsData || monthsData.length === 0) {
      monthsData = [
        { id: "mb-1", items: earningsConfig.month1Items || DEFAULT_EARNINGS_CONFIG.month1Items || [] },
        { id: "mb-2", items: earningsConfig.month2Items || DEFAULT_EARNINGS_CONFIG.month2Items || [] },
        { id: "mb-3", items: earningsConfig.month3Items || DEFAULT_EARNINGS_CONFIG.month3Items || [] },
      ];
    }

    const N = monthsData.length;
    const initialStart = Number(earningsConfig.initialStartingBalance ?? 0.37);

    let currentStart = initialStart;
    const computedBlocks: {
      id: string;
      monthIndex: number;
      dateHeader: string;
      startBalance: number;
      endBalance: number;
      items: TransactionItem[];
    }[] = new Array(N);

    // Compute from earliest month (index N-1) to latest month (index 0)
    for (let i = N - 1; i >= 0; i--) {
      const items = monthsData[i].items || [];
      const sum = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
      const start = currentStart;
      const end = Number((start + sum).toFixed(2));
      const dateHeader = computeMonthDateInfo(earningsConfig.customBaseDate, i);

      computedBlocks[i] = {
        id: monthsData[i].id || `mb-${i}`,
        monthIndex: i,
        dateHeader,
        startBalance: start,
        endBalance: end,
        items,
      };

      currentStart = end;
    }

    return {
      computedBlocks,
      latestEnd: N > 0 ? computedBlocks[0].endBalance : 0.42,
    };
  }, [earningsConfig]);

  // Determine Currency Code in header (e.g. EUR, USD, GBP, HKD)
  const displayCurrencyCode = useMemo(() => {
    if (earningsConfig.currencyCode) return earningsConfig.currencyCode;
    if (currencySymbol === "€") return "EUR";
    if (currencySymbol === "$") return "USD";
    if (currencySymbol === "£") return "GBP";
    if (currencySymbol === "HK$") return "HKD";
    if (currencySymbol === "¥") return "CNY";
    return "USD";
  }, [earningsConfig.currencyCode, currencySymbol]);

  const toggleBlock = (rowKey: string) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const renderTableRows = (items: TransactionItem[]) => {
    if (!items || items.length === 0) {
      return (
        <tr>
          <td
            colSpan={3}
            style={{
              textAlign: "center",
              padding: "54px 0",
              color: "#5f6368",
              fontSize: "13px",
              borderBottom: "none",
            }}
          >
            You don’t have any transactions for this billing period
          </td>
        </tr>
      );
    }

    return items.map((item, index) => {
      const isNegative = item.amount < 0;
      const formatted = formatCurrency(Math.abs(item.amount));
      const isPaymentLink = item.description.toLowerCase().includes("automatic payment");

      return (
        <tr key={item.id || index}>
          <td className="col-date">{item.date}</td>
          <td className="col-desc">
            {isPaymentLink ? (
              <a href="#payment-detail" className="blue-payment-link" onClick={(e) => e.preventDefault()}>
                {item.description}
              </a>
            ) : (
              item.description
            )}
          </td>
          <td className="col-amount align-right">
            {isNegative ? `-${formatted}` : formatted}
          </td>
        </tr>
      );
    });
  };

  return (
    <div
      className="payments-page-container"
      onDoubleClick={() => setIsConfigModalOpen(true)}
      title="Double-click to edit parameters and recalculate balances"
      style={{ userSelect: "none" }}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsModalOpen(true);
              }}
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
          <div className="payments-account-header">
            {productMode === "adsense" && (
              <>
                <span className="payments-account-sublabel">PAYMENTS ACCOUNT</span>
                <span className="payments-account-title">AdSense ({earningsConfig.countryName || "United Kingdom"})</span>
              </>
            )}
            <div className="breadcrumb-title-row">
              <span
                className="breadcrumb-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateBackToPayments?.();
                }}
              >
                Payments
              </span>
              <span className="breadcrumb-separator">&gt;</span>
              <h2 className="breadcrumb-current">Transactions</h2>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="transactions-filter-row">
            <div className="transactions-filter-controls" onClick={(e) => e.stopPropagation()}>
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
                <select defaultValue="all">
                  <option value="all">All history</option>
                  <option value="3months">Last 3 months</option>
                  <option value="6months">Last 6 months</option>
                  <option value="year">This year</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
          </div>

          {/* Dynamic N-Month Blocks Container */}
          <div className="transactions-period-blocks">
            {balances.computedBlocks.map((block, idx) => {
              const rowKey = `row${idx + 1}`;
              const isExpanded = expandedBlocks[rowKey] ?? true;

              return (
                <div key={block.id || idx}>
                  {isExpanded ? (
                    <div className="period-block expanded">
                      <div className="period-block-header" onClick={() => toggleBlock(rowKey)} style={{ cursor: "pointer" }}>
                        <h3 className="period-title">{block.dateHeader}</h3>
                        {block.items.length > 0 && (
                          <div className="header-action-icons">
                            <button className="icon-action-btn" title="Download" onClick={(e) => e.stopPropagation()}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#202124">
                                <g>
                                  <title>Download</title>
                                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                  <path d="M0 0h24v24H0z" fill="none" />
                                </g>
                              </svg>
                            </button>
                            <button className="icon-action-btn" title="Print" onClick={(e) => e.stopPropagation()}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#202124">
                                <g>
                                  <title>Print</title>
                                  <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                                  <path d="M0 0h24v24H0z" fill="none" />
                                </g>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="period-divider-line" />

                      <div className="period-balance-line align-right ending-line">
                        <span className="balance-text">Ending balance: {formatCurrency(block.endBalance)}</span>
                      </div>

                      <div className="transactions-table-wrap">
                        <table className="transactions-table">
                          <thead>
                            <tr>
                              <th className="col-date">Date</th>
                              <th className="col-desc">Description</th>
                              <th className="col-amount align-right">Amount ({displayCurrencyCode})</th>
                            </tr>
                          </thead>
                          <tbody>{renderTableRows(block.items)}</tbody>
                        </table>
                      </div>

                      <div className="period-balance-line align-right starting-line">
                        <span className="balance-text">Starting balance: {formatCurrency(block.startBalance)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="period-block collapsed" onClick={() => toggleBlock(rowKey)} style={{ cursor: "pointer" }}>
                      <span className="period-title-collapsed">{block.dateHeader}</span>
                      <span className="balance-text-collapsed">Ending balance: {formatCurrency(block.endBalance)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parameter Configuration Modal */}
      <TransactionsConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={earningsConfig}
        onSaveConfig={(newCfg) => setEarningsConfig(newCfg)}
      />
    </div>
  );
};
