import React, { useEffect, useState, useMemo } from "react";
import {
  ReportDimension,
  TimeRangeKey,
  MetricKey,
  RawReportRecord,
  AggregatedReportRow,
  MetricColumnDef,
  ALL_METRIC_COLUMNS,
  loadReportRecords,
  queryAndAggregateReport,
} from "../services/reportsDataEngine";
import { useBrowser } from "../context/BrowserContext";

interface ReportsPageProps {
  initialDimension?: ReportDimension;
}

const SettingsGearIcon = () => (
  <i
    className="material-icon-i material-icons-extended"
    style={{
      fontSize: "20px",
      color: "#5F6368",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      userSelect: "none",
    }}
  >
    settings
  </i>
);

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialDimension = "sites" }) => {
  const { currencySymbol, networkDelay, updateCurrentEntry } = useBrowser();

  const [activeDimension, setActiveDimension] = useState<ReportDimension>(initialDimension);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("last_7_days");
  const [activeMetric, setActiveMetric] = useState<MetricKey>("earnings");
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: "2026-08-01",
    end: "2026-08-05",
  });
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);

  // Dynamic Metrics Selection State
  const getInitialSelectedMetrics = (dim: ReportDimension): MetricKey[] => {
    try {
      const saved = localStorage.getItem(`adsense_metric_cols_${dim}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ALL_METRIC_COLUMNS.filter((m) => m.defaultVisible(dim)).map((m) => m.id);
  };

  const [selectedMetricIds, setSelectedMetricIds] = useState<MetricKey[]>(() =>
    getInitialSelectedMetrics(initialDimension)
  );
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [tempSelectedMetricIds, setTempSelectedMetricIds] = useState<MetricKey[]>(selectedMetricIds);

  const [rawRecords, setRawRecords] = useState<RawReportRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hiddenRowKeys, setHiddenRowKeys] = useState<Set<string>>(new Set());

  // Update selected metrics when dimension changes
  useEffect(() => {
    const nextMetrics = getInitialSelectedMetrics(activeDimension);
    setSelectedMetricIds(nextMetrics);
    if (!nextMetrics.includes(activeMetric)) {
      setActiveMetric("earnings");
    }
  }, [activeDimension]);

  const getActivePubId = (): string => {
    try {
      const saved = localStorage.getItem("adsense_earnings_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pubId) {
          let p = String(parsed.pubId).trim();
          if (!p.startsWith("pub-")) p = `pub-${p}`;
          return p;
        }
      }
    } catch (e) {}
    return "pub-8666469182451238";
  };

  // Dynamically update Browser Address Bar URL and Tab Title matching 1:1 Google AdSense
  useEffect(() => {
    const pubId = getActivePubId();
    let ag = "site";
    let oc = "earnings";
    let oo = "descending";
    let ct = "b";
    let titleName = "Sites";

    if (activeDimension === "by_day") {
      ag = "date";
      oc = "date";
      oo = "ascending";
      ct = "t";
      titleName = "Entire account by day";
    } else if (activeDimension === "sites") {
      ag = "site";
      oc = "earnings";
      oo = "descending";
      ct = "b";
      titleName = "Sites";
    } else if (activeDimension === "countries") {
      ag = "country";
      oc = "earnings";
      oo = "descending";
      ct = "b";
      titleName = "Countries";
    } else if (activeDimension === "ad_units") {
      ag = "adUnit";
      oc = "earnings";
      oo = "descending";
      ct = "b";
      titleName = "Ad units";
    }

    let drParam = "last7days";
    if (timeRange === "today") drParam = "today";
    else if (timeRange === "last_7_days") drParam = "last7days";
    else if (timeRange === "this_month") drParam = "thisMonth";
    else if (timeRange === "custom") drParam = `custom&drs=${customRange.start}&dre=${customRange.end}`;

    const mParam = selectedMetricIds.join("%2C");
    const dynamicUrl = `https://adsense.google.com/adsense/u/0/${pubId}/reporting/?rt=q&ag=${ag}&dr=${drParam}&gm=earnings&m=${mParam}&oc=${oc}&oo=${oo}&ct=${ct}`;
    const dynamicTitle = `${titleName} – Reports – Google AdSense`;

    updateCurrentEntry({
      url: dynamicUrl,
      title: dynamicTitle,
    });
  }, [activeDimension, timeRange, customRange, selectedMetricIds]);

  // Load records from Excel or defaults whenever activeDimension changes
  const fetchRecords = async () => {
    const records = await loadReportRecords(activeDimension);
    setTimeout(() => {
      setRawRecords(records);
    }, Math.min(300, networkDelay));
  };

  useEffect(() => {
    fetchRecords();
  }, [activeDimension]);

  // Aggregate data based on current dimension & time filter
  const { rows, totalRow, avgRow } = useMemo(() => {
    return queryAndAggregateReport(
      activeDimension,
      rawRecords,
      timeRange,
      customRange.start,
      customRange.end
    );
  }, [activeDimension, rawRecords, timeRange, customRange]);

  // Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    return rows.filter((r: AggregatedReportRow) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rows, searchQuery]);

  // Active Metric Columns to Render in Table
  const activeColumns = useMemo<MetricColumnDef[]>(() => {
    return ALL_METRIC_COLUMNS.filter((m) => selectedMetricIds.includes(m.id));
  }, [selectedMetricIds]);

  // Currency & Number Formatting Helpers
  const formatMoney = (val: number) => {
    const sym = currencySymbol || "$";
    return `${sym}${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatInt = (val: number) => {
    return val.toLocaleString("en-US");
  };

  const formatPercent = (val: number) => {
    return `${val.toFixed(2)}%`;
  };

  const formatCell = (col: MetricColumnDef, val: number, isAvg = false) => {
    if (isAvg && col.isAvgDashed) return "—";
    if (col.format === "money") return formatMoney(val);
    if (col.format === "int") return formatInt(val);
    if (col.format === "percent") return formatPercent(val);
    return val.toFixed(2);
  };

  const toggleRowVisibility = (key: string) => {
    const next = new Set(hiddenRowKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setHiddenRowKeys(next);
  };

  // Dimensions list for Left Sidebar
  const sidebarItems: { id: ReportDimension | string; name: string; subtitle: string; isReal: boolean }[] = [
    { id: "by_day", name: "Entire account by day", subtitle: "Estimated earnings by Date", isReal: true },
    { id: "top_pages", name: "Top pages", subtitle: "Earnings for your popular pa...", isReal: false },
    { id: "sites", name: "Sites", subtitle: "Performance of each site", isReal: true },
    { id: "content_platform", name: "Content platform", subtitle: "Estimated earnings by Platfo...", isReal: false },
    { id: "countries", name: "Countries", subtitle: "How ads perform by country", isReal: true },
    { id: "ad_units", name: "Ad units", subtitle: "Estimated earnings by Ad unit", isReal: true },
    { id: "platforms", name: "Platforms", subtitle: "Estimated earnings by Platf...", isReal: false },
    { id: "entire_account_week", name: "Entire account by week", subtitle: "Estimated earnings by Week", isReal: false },
    { id: "entire_account_month", name: "Entire account by month", subtitle: "Estimated earnings by Month", isReal: false },
    { id: "custom_channels", name: "Custom channels", subtitle: "Estimated earnings by Cust...", isReal: false },
    { id: "url_channels", name: "URL channels", subtitle: "Estimated earnings by URL c...", isReal: false },
    { id: "verified_sites", name: "Verified sites", subtitle: "Estimated earnings by Veri...", isReal: false },
  ];

  // Active chips metrics
  const activeChipsMetrics = useMemo(() => {
    return ALL_METRIC_COLUMNS.filter((m) => selectedMetricIds.includes(m.id));
  }, [selectedMetricIds]);

  // Dimension Header Title
  const dimensionTitle =
    activeDimension === "by_day"
      ? "Entire account by day"
      : activeDimension === "sites"
      ? "Sites"
      : activeDimension === "countries"
      ? "Countries"
      : "Ad units";

  const dimensionColName =
    activeDimension === "by_day"
      ? "DATE ↑"
      : activeDimension === "sites"
      ? "SITE"
      : activeDimension === "countries"
      ? "COUNTRY"
      : "AD UNIT";

  // Chart Max Scale Calculation
  const chartItems = useMemo(() => {
    const activeDef = ALL_METRIC_COLUMNS.find((m) => m.id === activeMetric);
    return filteredRows
      .filter((r: AggregatedReportRow) => !hiddenRowKeys.has(r.key))
      .map((r: AggregatedReportRow) => {
        const val = activeDef ? activeDef.getValue(r) : r.earnings;
        return {
          key: r.key,
          name: r.name,
          value: val,
        };
      });
  }, [filteredRows, activeMetric, hiddenRowKeys]);

  const maxChartVal = useMemo(() => {
    if (!chartItems || chartItems.length === 0) return 100;
    const m = Math.max(...chartItems.map((c) => c.value));
    return m > 0 ? m * 1.05 : 100;
  }, [chartItems]);

  const openMetricModal = () => {
    setTempSelectedMetricIds([...selectedMetricIds]);
    setIsMetricModalOpen(true);
  };

  const handleApplyMetrics = () => {
    if (tempSelectedMetricIds.length === 0) {
      alert("Please select at least one metric column.");
      return;
    }
    setSelectedMetricIds(tempSelectedMetricIds);
    try {
      localStorage.setItem(`adsense_metric_cols_${activeDimension}`, JSON.stringify(tempSelectedMetricIds));
    } catch (e) {}
    if (!tempSelectedMetricIds.includes(activeMetric)) {
      setActiveMetric(tempSelectedMetricIds[0]);
    }
    setIsMetricModalOpen(false);
  };

  const handleResetMetrics = () => {
    const defaults = ALL_METRIC_COLUMNS.filter((m) => m.defaultVisible(activeDimension)).map((m) => m.id);
    setTempSelectedMetricIds(defaults);
  };

  const toggleTempMetric = (id: MetricKey) => {
    if (tempSelectedMetricIds.includes(id)) {
      if (tempSelectedMetricIds.length <= 1) {
        alert("At least one metric column must remain visible.");
        return;
      }
      setTempSelectedMetricIds(tempSelectedMetricIds.filter((item) => item !== id));
    } else {
      setTempSelectedMetricIds([...tempSelectedMetricIds, id]);
    }
  };

  return (
    <div className="reports-root-layout">
      {/* Top Time Range Filter Bar */}
      <div className="reports-top-filter-bar">
        <div className="reports-time-pills">
          <button
            type="button"
            className={`reports-time-pill ${timeRange === "today" ? "active" : ""}`}
            onClick={() => setTimeRange("today")}
          >
            {timeRange === "today" && <span className="pill-check">✓</span>} Today
          </button>
          <button
            type="button"
            className={`reports-time-pill ${timeRange === "last_7_days" ? "active" : ""}`}
            onClick={() => setTimeRange("last_7_days")}
          >
            {timeRange === "last_7_days" && <span className="pill-check">✓</span>} Last 7 days
          </button>
          <button
            type="button"
            className={`reports-time-pill ${timeRange === "this_month" ? "active" : ""}`}
            onClick={() => setTimeRange("this_month")}
          >
            {timeRange === "this_month" && <span className="pill-check">✓</span>} This month
          </button>
          <button
            type="button"
            className="reports-time-pill disabled"
            disabled
          >
            Last month
          </button>

          {/* Custom Date Range Pill */}
          <div className="reports-custom-pill-wrap">
            <button
              type="button"
              className={`reports-time-pill custom-pill ${timeRange === "custom" ? "active" : ""}`}
              onClick={() => {
                setTimeRange("custom");
                setIsCustomDropdownOpen(!isCustomDropdownOpen);
              }}
            >
              {timeRange === "custom" && <span className="pill-check">✓</span>} Aug 1 – 5, 2026
              <span className="pill-arrow">▼</span>
            </button>

            {isCustomDropdownOpen && (
              <div className="custom-date-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="custom-date-header">Custom Date Range (自定义时间)</div>
                <div className="custom-date-inputs">
                  <div>
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>End Date:</label>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-apply-custom-date"
                  onClick={() => {
                    setTimeRange("custom");
                    setIsCustomDropdownOpen(false);
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <span
            className="reports-add-comparison"
            onClick={openMetricModal}
            title="Manage metrics"
          >
            + Add comparison
          </span>
        </div>

        <div className="reports-top-right-tools">
          <button
            type="button"
            className="reports-gear-btn"
            title="Manage metrics"
            onClick={openMetricModal}
          >
            <SettingsGearIcon />
          </button>
        </div>
      </div>

      {/* Reports Body Layout */}
      <div className="reports-body-container">
        {/* Left Sidebar */}
        <div className="reports-sidebar">
          <div className="reports-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#70757a">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search reports"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="reports-search-plus" title="Add report">+</span>
          </div>

          <div className="reports-sidebar-list">
            {sidebarItems.map((item) => {
              const isActive = activeDimension === item.id;
              return (
                <div
                  key={item.id}
                  className={`reports-sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    if (item.isReal) {
                      setActiveDimension(item.id as ReportDimension);
                    }
                  }}
                >
                  <div className="sidebar-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? "#1a73e8" : "#5f6368"}>
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                  </div>
                  <div className="sidebar-item-texts">
                    <div className="sidebar-item-title">{item.name}</div>
                    <div className="sidebar-item-desc">{item.subtitle}</div>
                  </div>
                  <span className="sidebar-item-more">⋮</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="reports-content-area" onDoubleClick={fetchRecords}>
          {/* Header Bar */}
          <div className="reports-content-header">
            <div className="reports-header-left">
              <span className="reports-drag-icon">⋮⋮</span>
              <h2 className="reports-header-title">{dimensionTitle}</h2>
            </div>
            <div className="reports-header-right">
              <button className="reports-save-btn" disabled>Save</button>
              <button className="reports-more-btn">⋮</button>
            </div>
          </div>

          {/* Breakdowns Filter Controls */}
          <div className="reports-breakdowns-row">
            <div className="breakdown-tag-wrap">
              <span className="breakdown-label">Breakdowns:</span>
              <div className="breakdown-pill">
                {activeDimension === "by_day"
                  ? "Date"
                  : activeDimension === "sites"
                  ? "Site"
                  : activeDimension === "countries"
                  ? "Country"
                  : "Ad unit"}{" "}
                ▼
              </div>
              <span
                className="breakdown-add-link"
                onClick={openMetricModal}
                title="Manage metrics"
              >
                + Add
              </span>
            </div>

            <div className="breakdown-search-filter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
              </svg>
              <input
                type="text"
                placeholder="Search or filter your data"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Metric Chips Bar */}
          <div className="reports-metrics-bar">
            <div className="metrics-chips-list">
              {activeChipsMetrics.map((m) => {
                const isSelected = activeMetric === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`metric-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => setActiveMetric(m.id)}
                  >
                    {isSelected && <span className="metric-chip-check">✓</span>}
                    {m.label}
                  </button>
                );
              })}
              <button
                type="button"
                className="metric-chip-pencil"
                title="Edit metrics"
                onClick={openMetricModal}
              >
                ✎
              </button>
            </div>

            <div className="metrics-chart-toggle" title="Toggle Chart View">
              📈
            </div>
          </div>

          {/* Visual Chart Card */}
          <div className="reports-chart-card">
            <div className="chart-header-row">
              <span className="chart-title">
                {ALL_METRIC_COLUMNS.find((m) => m.id === activeMetric)?.label || "Estimated earnings"}
              </span>
              {activeDimension === "by_day" && <span className="chart-blue-dot" />}
            </div>

            {/* Line Chart for Entire account by day */}
            {activeDimension === "by_day" ? (
              <div className="reports-line-chart-wrap">
                <svg className="reports-svg-line-chart" viewBox="0 0 900 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="880" y2="40" stroke="#f1f3f4" strokeWidth="1" />
                  <line x1="40" y1="90" x2="880" y2="90" stroke="#f1f3f4" strokeWidth="1" />
                  <line x1="40" y1="140" x2="880" y2="140" stroke="#f1f3f4" strokeWidth="1" />
                  <line x1="40" y1="190" x2="880" y2="190" stroke="#f1f3f4" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="35" y="44" textAnchor="end" fill="#70757a" fontSize="11">$800.00</text>
                  <text x="35" y="94" textAnchor="end" fill="#70757a" fontSize="11">$600.00</text>
                  <text x="35" y="144" textAnchor="end" fill="#70757a" fontSize="11">$400.00</text>
                  <text x="35" y="194" textAnchor="end" fill="#70757a" fontSize="11">$200.00</text>

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#1a73e8"
                    strokeWidth="2"
                    points="60,190 180,60 300,190 420,190 540,190 660,190 780,190 860,190"
                  />

                  {/* Highlight Data Point Dot */}
                  <circle cx="180" cy="60" r="4.5" fill="#1a73e8" />
                  <circle cx="180" cy="60" r="7.5" fill="none" stroke="#1a73e8" strokeWidth="1.5" opacity="0.4" />
                </svg>

                {/* Bottom X-Axis Dates */}
                <div className="line-chart-x-axis">
                  <span>Aug 15</span>
                  <span className="x-active-date">Aug 16</span>
                  <span>Aug 17</span>
                  <span>Aug 18</span>
                  <span>Aug 19</span>
                  <span>Aug 20</span>
                  <span>Aug 21</span>
                </div>
              </div>
            ) : (
              /* Bar Chart for Sites / Countries / Ad Units */
              <div className="reports-bar-chart-wrap">
                <div className="bar-chart-rows-list">
                  {chartItems.slice(0, 10).map((item) => {
                    const barPercent = Math.min(100, (item.value / maxChartVal) * 100);
                    return (
                      <div key={item.key} className="bar-chart-row">
                        <div className="bar-chart-label" title={item.name}>
                          {item.name}
                        </div>
                        <div className="bar-chart-track">
                          <div className="bar-chart-fill" style={{ width: `${barPercent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom X-Axis Ticks */}
                <div className="bar-chart-x-ticks">
                  <span>$0.00</span>
                  <span>${(maxChartVal * 0.15).toFixed(2)}</span>
                  <span>${(maxChartVal * 0.3).toFixed(2)}</span>
                  <span>${(maxChartVal * 0.45).toFixed(2)}</span>
                  <span>${(maxChartVal * 0.6).toFixed(2)}</span>
                  <span>${(maxChartVal * 0.75).toFixed(2)}</span>
                  <span>${(maxChartVal * 0.9).toFixed(2)}</span>
                  <span>${maxChartVal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Data Table Card */}
          <div className="reports-table-card">
            <table className="reports-data-table">
              <thead
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openMetricModal();
                }}
                style={{ cursor: "pointer", userSelect: "none" }}
                title="双击表头定制衡量指标 / Double-click header to customize columns"
              >
                <tr>
                  <th className="th-col-dim">{dimensionColName}</th>
                  {activeColumns.map((col) => (
                    <th key={col.id} className="th-col-metric align-right">
                      {col.id === "earnings" && activeDimension === "sites"
                        ? "↓ Estimated earnings *"
                        : col.id === "earnings"
                        ? "↓ Estimated earnings"
                        : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Total 'All' Row */}
                <tr className="tr-total-row">
                  <td className="td-col-dim">
                    <span className="eye-toggle-btn disabled" title="Total row">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#70757a">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    </span>
                    <span className="row-dim-name bold">{totalRow.name}</span>
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.id}
                      className={`td-col-metric align-right bold ${col.id === "earnings" ? "amount-font" : ""}`}
                    >
                      {formatCell(col, col.getValue(totalRow))}
                    </td>
                  ))}
                </tr>

                {/* Average Row */}
                <tr className="tr-avg-row">
                  <td className="td-col-dim">
                    <span className="eye-toggle-btn invisible">👁</span>
                    <span className="row-dim-name italic">{avgRow.name}</span>
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.id}
                      className={`td-col-metric align-right italic ${col.id === "earnings" ? "amount-font" : ""}`}
                    >
                      {formatCell(col, col.getValue(avgRow), true)}
                    </td>
                  ))}
                </tr>

                {/* Empty State Prompt */}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={activeColumns.length + 1}
                      style={{
                        textAlign: "center",
                        padding: "32px 16px",
                        color: "#70757a",
                        fontSize: "13px",
                      }}
                    >
                      No data to display
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {filteredRows.map((row: AggregatedReportRow) => {
                  const isHidden = hiddenRowKeys.has(row.key);
                  return (
                    <tr key={row.key} className={`tr-data-row ${isHidden ? "dimmed" : ""}`}>
                      <td className="td-col-dim">
                        <button
                          type="button"
                          className="eye-toggle-btn"
                          onClick={() => toggleRowVisibility(row.key)}
                          title="Toggle chart visibility"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={isHidden ? "#bdc1c6" : "#5f6368"}>
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </button>
                        <span className="row-dim-name">{row.name}</span>
                      </td>
                      {activeColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`td-col-metric align-right ${col.id === "earnings" ? "amount-font" : ""}`}
                        >
                          {formatCell(col, col.getValue(row))}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table Footer */}
            <div className="reports-table-footer">
              <div className="footer-pagination-wrap">
                <span>Rows per page:</span>
                <select className="pagination-select" defaultValue="10">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>

                <span className="pagination-info">
                  1 – {Math.min(10, filteredRows.length)} of {filteredRows.length}
                </span>

                <div className="pagination-arrows">
                  <button className="page-arrow disabled" disabled>⇤</button>
                  <button className="page-arrow disabled" disabled>‹</button>
                  <button className="page-arrow disabled" disabled>›</button>
                  <button className="page-arrow disabled" disabled>⇥</button>
                </div>
              </div>

              <div className="footer-disclaimer">
                * Estimated site earnings may be inaccurate and are only an indication of your earnings.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Customization Modal (Bilingual 中英文双语支持) */}
      {isMetricModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(32, 33, 36, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsMetricModalOpen(false)}
        >
          <div
            style={{
              width: "600px",
              maxWidth: "92vw",
              maxHeight: "85vh",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "Roboto, Arial, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid #dadce0",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 500, color: "#202124" }}>
                Customize Metrics / 定制衡量指标
              </h3>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  color: "#5f6368",
                  cursor: "pointer",
                  padding: "4px",
                }}
                onClick={() => setIsMetricModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Category: Estimated earnings */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #f1f3f4",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Estimated earnings / 预估收入与RPM
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 16px" }}>
                  {ALL_METRIC_COLUMNS.filter((m) => m.category === "earnings").map((m) => {
                    const isChecked = tempSelectedMetricIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#202124",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTempMetric(m.id)}
                          style={{ width: "16px", height: "16px", accentColor: "#1a73e8", cursor: "pointer", flexShrink: 0 }}
                        />
                        <span style={{ lineHeight: 1.3 }}>
                          <strong>{m.label}</strong>
                          <span style={{ color: "#70757a", fontSize: "12px", display: "block" }}>{m.labelZh}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category: Page views & Impressions */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #f1f3f4",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Page views & Impressions / 浏览量与展示量
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 16px" }}>
                  {ALL_METRIC_COLUMNS.filter((m) => m.category === "views").map((m) => {
                    const isChecked = tempSelectedMetricIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#202124",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTempMetric(m.id)}
                          style={{ width: "16px", height: "16px", accentColor: "#1a73e8", cursor: "pointer", flexShrink: 0 }}
                        />
                        <span style={{ lineHeight: 1.3 }}>
                          <strong>{m.label}</strong>
                          <span style={{ color: "#70757a", fontSize: "12px", display: "block" }}>{m.labelZh}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category: Clicks & CTR */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #f1f3f4",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Clicks & CTR / 点击与点击率
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 16px" }}>
                  {ALL_METRIC_COLUMNS.filter((m) => m.category === "clicks").map((m) => {
                    const isChecked = tempSelectedMetricIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#202124",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTempMetric(m.id)}
                          style={{ width: "16px", height: "16px", accentColor: "#1a73e8", cursor: "pointer", flexShrink: 0 }}
                        />
                        <span style={{ lineHeight: 1.3 }}>
                          <strong>{m.label}</strong>
                          <span style={{ color: "#70757a", fontSize: "12px", display: "block" }}>{m.labelZh}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category: Requests & Coverage */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #f1f3f4",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Requests & Coverage / 请求数与覆盖率
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 16px" }}>
                  {ALL_METRIC_COLUMNS.filter((m) => m.category === "requests").map((m) => {
                    const isChecked = tempSelectedMetricIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#202124",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTempMetric(m.id)}
                          style={{ width: "16px", height: "16px", accentColor: "#1a73e8", cursor: "pointer", flexShrink: 0 }}
                        />
                        <span style={{ lineHeight: 1.3 }}>
                          <strong>{m.label}</strong>
                          <span style={{ color: "#70757a", fontSize: "12px", display: "block" }}>{m.labelZh}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                borderTop: "1px solid #dadce0",
                backgroundColor: "#fafafa",
              }}
            >
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#1a73e8",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: "6px 10px",
                }}
                onClick={handleResetMetrics}
              >
                Reset to default / 恢复默认
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "1px solid #dadce0",
                    color: "#3c4043",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "7px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsMetricModalOpen(false)}
                >
                  Cancel / 取消
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: "#1a73e8",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "8px 20px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={handleApplyMetrics}
                >
                  Apply / 应用
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official 1:1 Floating feedback button */}
      <div
        className="feedback-fab reports-floating-feedback"
        title="Send feedback"
        role="button"
        aria-label="Send feedback"
      >
        <button type="button" className="mdc-fab" aria-label="Send feedback">
          <div className="button-content">
            <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true">
              feedback
            </i>
          </div>
        </button>
      </div>
    </div>
  );
};
