import * as XLSX from "xlsx";

export type ReportDimension = "by_day" | "sites" | "countries" | "ad_units";
export type TimeRangeKey = "today" | "last_7_days" | "this_month" | "custom";
export type MetricKey =
  | "earnings"
  | "pageViews"
  | "pageRpm"
  | "impressions"
  | "impressionRpm"
  | "activeViewViewable"
  | "clicks";

export interface RawReportRecord {
  date: string; // YYYY-MM-DD
  dimensionName: string; // Domain, Country Name, Ad Unit Name, etc.
  earnings: number;
  pageViews: number;
  impressions: number;
  clicks: number;
  activeViewPercent?: number;
}

export interface AggregatedReportRow {
  key: string;
  name: string;
  isTotal?: boolean;
  isAverage?: boolean;
  isHidden?: boolean;
  earnings: number;
  pageViews: number;
  pageRpm: number;
  impressions: number;
  impressionRpm: number;
  activeViewViewable: number;
  clicks: number;
}

export interface ChartBarItem {
  name: string;
  value: number;
  formattedValue: string;
  percent: number;
}

export interface ChartLinePoint {
  dateLabel: string;
  dateKey: string;
  value: number;
  formattedValue: string;
}

// Built-in high fidelity fallback records derived directly from real account capture
export const DEFAULT_SITES_RECORDS: RawReportRecord[] = [
  { date: "2026-08-15", dimensionName: "fun.sihec.com", earnings: 405.65, pageViews: 16738, impressions: 22306, clicks: 1088, activeViewPercent: 97.43 },
  { date: "2026-08-16", dimensionName: "fun.sihec.com", earnings: 2.80, pageViews: 2852, impressions: 71, clicks: 10, activeViewPercent: 85.92 },
  { date: "2026-08-17", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0 },
  { date: "2026-08-18", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0 },
  { date: "2026-08-19", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 5, impressions: 0, clicks: 0, activeViewPercent: 0 },
  { date: "2026-08-20", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0 },
  { date: "2026-08-21", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0 },
];

export const DEFAULT_COUNTRIES_RECORDS: RawReportRecord[] = [
  { date: "2026-08-15", dimensionName: "United States", earnings: 368.36, pageViews: 14648, impressions: 16771, clicks: 822, activeViewPercent: 97.55 },
  { date: "2026-08-15", dimensionName: "Canada", earnings: 7.70, pageViews: 527, impressions: 600, clicks: 31, activeViewPercent: 96.99 },
  { date: "2026-08-15", dimensionName: "United Kingdom", earnings: 6.21, pageViews: 201, impressions: 286, clicks: 71, activeViewPercent: 97.90 },
  { date: "2026-08-15", dimensionName: "Australia", earnings: 4.01, pageViews: 276, impressions: 213, clicks: 8, activeViewPercent: 97.65 },
  { date: "2026-08-15", dimensionName: "Japan", earnings: 3.85, pageViews: 190, impressions: 210, clicks: 6, activeViewPercent: 98.10 },
  { date: "2026-08-15", dimensionName: "Sweden", earnings: 2.10, pageViews: 110, impressions: 130, clicks: 4, activeViewPercent: 96.50 },
  { date: "2026-08-15", dimensionName: "Denmark", earnings: 1.80, pageViews: 85, impressions: 95, clicks: 3, activeViewPercent: 95.80 },
  { date: "2026-08-15", dimensionName: "South Africa", earnings: 1.50, pageViews: 70, impressions: 80, clicks: 2, activeViewPercent: 94.20 },
  { date: "2026-08-15", dimensionName: "Hong Kong", earnings: 1.45, pageViews: 65, impressions: 72, clicks: 2, activeViewPercent: 95.00 },
  { date: "2026-08-15", dimensionName: "New Zealand", earnings: 1.47, pageViews: 52, impressions: 60, clicks: 2, activeViewPercent: 96.10 },
  { date: "2026-08-16", dimensionName: "United States", earnings: 2.80, pageViews: 2852, impressions: 71, clicks: 10, activeViewPercent: 85.92 },
];

export const DEFAULT_AD_UNITS_RECORDS: RawReportRecord[] = [
  { date: "2026-08-15", dimensionName: "fun.sihec.com_banner_01", earnings: 83.34, pageViews: 16738, impressions: 9393, clicks: 230, activeViewPercent: 97.69 },
  { date: "2026-08-15", dimensionName: "fun.sihec.com_banner_03", earnings: 3.13, pageViews: 16738, impressions: 63, clicks: 10, activeViewPercent: 98.41 },
];

// Helper: Format Date string
export function formatDateHeader(dStr: string): string {
  try {
    const d = new Date(dStr + "T00:00:00");
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return dStr;
  }
}

// Helper: Filter records by time range
export function filterRecordsByTimeRange(
  records: RawReportRecord[],
  timeRange: TimeRangeKey,
  customStart = "2026-08-01",
  customEnd = "2026-08-05"
): RawReportRecord[] {
  if (!records || records.length === 0) return [];

  // Determine date bounds
  if (timeRange === "today") {
    // Latest date in records
    const latestDate = records.reduce((max, r) => (r.date > max ? r.date : max), records[0].date);
    return records.filter((r) => r.date === latestDate);
  } else if (timeRange === "last_7_days") {
    // Last 7 calendar days relative to base / latest date
    const sortedDates = Array.from(new Set(records.map((r) => r.date))).sort();
    const targetDates = sortedDates.slice(-7);
    return records.filter((r) => targetDates.includes(r.date));
  } else if (timeRange === "this_month") {
    // Current month (e.g. 2026-08)
    const latestDate = records.reduce((max, r) => (r.date > max ? r.date : max), records[0].date);
    const monthPrefix = latestDate.substring(0, 7);
    return records.filter((r) => r.date.startsWith(monthPrefix));
  } else if (timeRange === "custom") {
    return records.filter((r) => r.date >= customStart && r.date <= customEnd);
  }
  return records;
}

// Query & Aggregate engine
export function queryAndAggregateReport(
  dimension: ReportDimension,
  rawRecords: RawReportRecord[],
  timeRange: TimeRangeKey,
  customStart = "2026-08-01",
  customEnd = "2026-08-05"
): {
  rows: AggregatedReportRow[];
  totalRow: AggregatedReportRow;
  avgRow: AggregatedReportRow;
  allDates: string[];
} {
  const filtered = filterRecordsByTimeRange(rawRecords, timeRange, customStart, customEnd);
  const allDates = Array.from(new Set(filtered.map((r) => r.date))).sort();

  const grouped = new Map<string, { earnings: number; pageViews: number; impressions: number; clicks: number; activeViewsWeighted: number }>();

  if (dimension === "by_day") {
    // Group by Date
    for (const r of filtered) {
      const key = r.date;
      const cur = grouped.get(key) || { earnings: 0, pageViews: 0, impressions: 0, clicks: 0, activeViewsWeighted: 0 };
      cur.earnings += r.earnings;
      cur.pageViews += r.pageViews;
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      cur.activeViewsWeighted += (r.activeViewPercent ?? 97.4) * r.impressions;
      grouped.set(key, cur);
    }
  } else {
    // Group by Dimension Name (Site / Country / Ad Unit)
    for (const r of filtered) {
      const key = r.dimensionName;
      const cur = grouped.get(key) || { earnings: 0, pageViews: 0, impressions: 0, clicks: 0, activeViewsWeighted: 0 };
      cur.earnings += r.earnings;
      cur.pageViews += r.pageViews;
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      cur.activeViewsWeighted += (r.activeViewPercent ?? 97.4) * r.impressions;
      grouped.set(key, cur);
    }
  }

  const rows: AggregatedReportRow[] = [];
  let totalEarnings = 0;
  let totalPageViews = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalActiveWeighted = 0;

  for (const [name, data] of grouped.entries()) {
    const pageRpm = data.pageViews > 0 ? Number(((data.earnings / data.pageViews) * 1000).toFixed(2)) : 0;
    const impressionRpm = data.impressions > 0 ? Number(((data.earnings / data.impressions) * 1000).toFixed(2)) : 0;
    const activeViewViewable = data.impressions > 0 ? Number((data.activeViewsWeighted / data.impressions).toFixed(2)) : 97.4;

    totalEarnings += data.earnings;
    totalPageViews += data.pageViews;
    totalImpressions += data.impressions;
    totalClicks += data.clicks;
    totalActiveWeighted += data.activeViewsWeighted;

    rows.push({
      key: name,
      name: dimension === "by_day" ? formatDateHeader(name) : name,
      earnings: Number(data.earnings.toFixed(2)),
      pageViews: data.pageViews,
      pageRpm,
      impressions: data.impressions,
      impressionRpm,
      activeViewViewable,
      clicks: data.clicks,
    });
  }

  // Sort rows descending by earnings
  if (dimension === "by_day") {
    // Sort dates ascending/descending
    rows.sort((a, b) => b.key.localeCompare(a.key));
  } else {
    rows.sort((a, b) => b.earnings - a.earnings);
  }

  const rowCount = Math.max(1, rows.length);
  const totalPageRpm = totalPageViews > 0 ? Number(((totalEarnings / totalPageViews) * 1000).toFixed(2)) : 0;
  const totalImpressionRpm = totalImpressions > 0 ? Number(((totalEarnings / totalImpressions) * 1000).toFixed(2)) : 0;
  const totalActiveView = totalImpressions > 0 ? Number((totalActiveWeighted / totalImpressions).toFixed(2)) : 97.4;

  const totalRow: AggregatedReportRow = {
    key: "all_total",
    name: "All",
    isTotal: true,
    earnings: Number(totalEarnings.toFixed(2)),
    pageViews: totalPageViews,
    pageRpm: totalPageRpm,
    impressions: totalImpressions,
    impressionRpm: totalImpressionRpm,
    activeViewViewable: totalActiveView,
    clicks: totalClicks,
  };

  const avgRow: AggregatedReportRow = {
    key: "average_row",
    name: "Average",
    isAverage: true,
    earnings: Number((totalEarnings / rowCount).toFixed(2)),
    pageViews: Math.round(totalPageViews / rowCount),
    pageRpm: 0, // In Google Adsense, Average RPM columns display dash "—"
    impressions: Math.round(totalImpressions / rowCount),
    impressionRpm: 0,
    activeViewViewable: 0,
    clicks: Math.round(totalClicks / rowCount),
  };

  return { rows, totalRow, avgRow, allDates };
}

// Generate Excel file buffers for downloading / initial creation
export function createExcelBuffer(records: RawReportRecord[], dimensionHeader: string): ArrayBuffer {
  const wsData = [
    ["Date", dimensionHeader, "Estimated earnings", "Page views", "Impressions", "Clicks", "Active View Viewable %"],
    ...records.map((r) => [
      r.date,
      r.dimensionName,
      r.earnings,
      r.pageViews,
      r.impressions,
      r.clicks,
      r.activeViewPercent ?? 97.4,
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

// Parse Excel from ArrayBuffer or File
export function parseExcelRecords(buffer: ArrayBuffer): RawReportRecord[] {
  try {
    const wb = XLSX.read(buffer, { type: "array" });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return [];
    const ws = wb.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });
    if (rawRows.length < 2) return [];

    const records: RawReportRecord[] = [];
    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0 || !row[0]) continue;
      records.push({
        date: String(row[0]).trim(),
        dimensionName: String(row[1] || "").trim(),
        earnings: Number(row[2]) || 0,
        pageViews: Number(row[3]) || 0,
        impressions: Number(row[4]) || 0,
        clicks: Number(row[5]) || 0,
        activeViewPercent: Number(row[6]) || 97.4,
      });
    }
    return records;
  } catch (err) {
    console.error("Failed to parse excel records:", err);
    return [];
  }
}

// Universal Loader for Excel files with fallback to built-in datasets
export async function loadReportRecords(dimension: ReportDimension): Promise<RawReportRecord[]> {
  const fileNameMap: Record<ReportDimension, string> = {
    sites: "按站点.xlsx",
    countries: "按国家.xlsx",
    ad_units: "按广告单元.xlsx",
    by_day: "按站点.xlsx",
  };

  const defaultDataMap: Record<ReportDimension, RawReportRecord[]> = {
    sites: DEFAULT_SITES_RECORDS,
    countries: DEFAULT_COUNTRIES_RECORDS,
    ad_units: DEFAULT_AD_UNITS_RECORDS,
    by_day: DEFAULT_SITES_RECORDS,
  };

  const fileName = fileNameMap[dimension];
  try {
    const res = await fetch(`/${fileName}?t=${Date.now()}`);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const records = parseExcelRecords(buffer);
      if (records && records.length > 0) {
        return records;
      }
    }
  } catch (err) {
    console.warn(`[Reports] Could not load ${fileName} via fetch, falling back to default records.`, err);
  }

  return defaultDataMap[dimension];
}
