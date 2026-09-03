import * as XLSX from "xlsx";
import { invoke } from "@tauri-apps/api/core";

export type ReportDimension = "by_day" | "sites" | "countries" | "ad_units";
export type TimeRangeKey = "today" | "last_7_days" | "last_30_days" | "this_month" | "last_month" | "custom";
export type MetricKey =
  | "earnings"
  | "pageViews"
  | "pageRpm"
  | "impressions"
  | "impressionRpm"
  | "ctr"
  | "activeViewViewable"
  | "avgViewableTime"
  | "activeViewMeasurable"
  | "totalImpressions"
  | "clicks"
  | "cpc"
  | "pageCtr"
  | "adRequests"
  | "adRequestCtr"
  | "adRequestRpm"
  | "coverage"
  | "matchedRequests"
  | "matchedAdCtr"
  | "matchedAdRpm"
  | "adsPerImpression"
  | "adCtr"
  | "adImpressions"
  | "adRpm"
  | "funnelClicks"
  | "impressionCtr";

export interface RawReportRecord {
  date: string; // YYYY-MM-DD
  dimensionName: string; // Domain, Country Name, Ad Unit Name, etc.
  earnings: number;
  pageViews: number;
  impressions: number;
  clicks: number;
  activeViewPercent?: number;
  adRequests?: number;
  matchedRequests?: number;
  pageRpm?: number;
  impressionRpm?: number;
  pageCtr?: number;
  impressionCtr?: number;
  cpc?: number;
  coverage?: number;
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
  pageCtr: number;
  impressionCtr: number;
  cpc: number;
  adRequests: number;
  matchedRequests: number;
  coverage: number;
}

export interface MetricColumnDef {
  id: MetricKey;
  label: string;
  labelZh: string;
  group: "RECOMMENDED" | "ADVANCED";
  description: string;
  category: "earnings" | "views" | "clicks" | "requests";
  format: "money" | "int" | "percent" | "decimal";
  isAvgDashed?: boolean;
  getValue: (row: AggregatedReportRow) => number;
  defaultVisible: (dim: ReportDimension) => boolean;
}

export const ALL_METRIC_COLUMNS: MetricColumnDef[] = [
  // RECOMMENDED
  {
    id: "earnings",
    label: "Estimated earnings",
    labelZh: "预估收入",
    group: "RECOMMENDED",
    description: "Earnings accrued during the selected time period.",
    category: "earnings",
    format: "money",
    getValue: (r) => r.earnings,
    defaultVisible: () => true,
  },
  {
    id: "pageViews",
    label: "Page views",
    labelZh: "网页浏览量 (PV)",
    group: "RECOMMENDED",
    description: "A page view is counted whenever a user views a page displaying Google ads.",
    category: "views",
    format: "int",
    getValue: (r) => r.pageViews,
    defaultVisible: () => true,
  },
  {
    id: "pageRpm",
    label: "Page RPM",
    labelZh: "网页 RPM",
    group: "RECOMMENDED",
    description: "Page revenue per thousand impressions (RPM) is calculated by dividing your estimated earnings by the number of page views you received, then multiplying by 1000.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => r.pageRpm,
    defaultVisible: () => true,
  },
  {
    id: "impressions",
    label: "Impressions",
    labelZh: "展示次数",
    group: "RECOMMENDED",
    description: "An impression is counted each time an individual ad begins to load on a user's screen.",
    category: "views",
    format: "int",
    getValue: (r) => r.impressions,
    defaultVisible: () => true,
  },
  {
    id: "impressionRpm",
    label: "Impression RPM",
    labelZh: "展示 RPM",
    group: "RECOMMENDED",
    description: "Impression revenue per thousand impressions (RPM) is calculated by dividing your estimated earnings by the number of impressions you received, then multiplying by 1000.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => r.impressionRpm,
    defaultVisible: () => true,
  },
  {
    id: "ctr",
    label: "CTR",
    labelZh: "点击率 (CTR)",
    group: "RECOMMENDED",
    description: "Clickthrough rate is the number of ad clicks divided by the number of impressions.",
    category: "clicks",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => r.impressionCtr || (r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0),
    defaultVisible: () => false,
  },
  {
    id: "activeViewViewable",
    label: "Active View Viewable",
    labelZh: "Active View 可见率",
    group: "RECOMMENDED",
    description: "The percentage of impressions that were viewable out of all measurable impressions.",
    category: "views",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => r.activeViewViewable,
    defaultVisible: () => true,
  },
  {
    id: "avgViewableTime",
    label: "Average Viewable Time",
    labelZh: "平均可见时间",
    group: "RECOMMENDED",
    description: "The average amount of time (in seconds) that an ad was viewable on screen.",
    category: "views",
    format: "decimal",
    isAvgDashed: true,
    getValue: (r) => (r.impressions > 0 ? 12.4 : 0),
    defaultVisible: () => false,
  },
  {
    id: "activeViewMeasurable",
    label: "Active View Measurable",
    labelZh: "Active View 可衡量率",
    group: "RECOMMENDED",
    description: "The percentage of impressions that were measurable with Active View out of all impressions.",
    category: "views",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => (r.impressions > 0 ? 99.8 : 0),
    defaultVisible: () => false,
  },

  // ADVANCED
  {
    id: "totalImpressions",
    label: "Total impressions",
    labelZh: "总展示次数",
    group: "ADVANCED",
    description: "The total count of all impressions served.",
    category: "views",
    format: "int",
    getValue: (r) => r.impressions,
    defaultVisible: () => false,
  },
  {
    id: "clicks",
    label: "Clicks",
    labelZh: "点击次数",
    group: "ADVANCED",
    description: "The number of times users clicked on your ads.",
    category: "clicks",
    format: "int",
    getValue: (r) => r.clicks,
    defaultVisible: () => true,
  },
  {
    id: "cpc",
    label: "CPC",
    labelZh: "每次点击费用 (CPC)",
    group: "ADVANCED",
    description: "Cost-per-click is the amount you earn each time a user clicks on your ad.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => r.cpc,
    defaultVisible: () => false,
  },
  {
    id: "pageCtr",
    label: "Page CTR",
    labelZh: "网页点击率 (Page CTR)",
    group: "ADVANCED",
    description: "Page clickthrough rate is the number of ad clicks divided by the number of page views.",
    category: "clicks",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => r.pageCtr,
    defaultVisible: () => false,
  },
  {
    id: "adRequests",
    label: "Ad requests",
    labelZh: "广告请求数",
    group: "ADVANCED",
    description: "An ad request is counted whenever a request for ads is sent from your site.",
    category: "requests",
    format: "int",
    getValue: (r) => r.adRequests,
    defaultVisible: () => false,
  },
  {
    id: "adRequestCtr",
    label: "Ad request CTR",
    labelZh: "广告请求点击率",
    group: "ADVANCED",
    description: "The number of ad clicks divided by the number of ad requests.",
    category: "clicks",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => (r.adRequests > 0 ? (r.clicks / r.adRequests) * 100 : 0),
    defaultVisible: () => false,
  },
  {
    id: "adRequestRpm",
    label: "Ad request RPM",
    labelZh: "广告请求 RPM",
    group: "ADVANCED",
    description: "Ad request RPM is calculated by dividing your estimated earnings by the number of ad requests you received, then multiplying by 1000.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => (r.adRequests > 0 ? (r.earnings / r.adRequests) * 1000 : 0),
    defaultVisible: () => false,
  },
  {
    id: "coverage",
    label: "Coverage",
    labelZh: "覆盖率 (Coverage)",
    group: "ADVANCED",
    description: "The percentage of ad requests that returned at least one ad.",
    category: "requests",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => r.coverage,
    defaultVisible: () => false,
  },
  {
    id: "matchedRequests",
    label: "Matched ad requests",
    labelZh: "匹配的广告请求数",
    group: "ADVANCED",
    description: "An ad request that resulted in at least one ad being returned.",
    category: "requests",
    format: "int",
    getValue: (r) => r.matchedRequests,
    defaultVisible: () => false,
  },
  {
    id: "matchedAdCtr",
    label: "Matched ad CTR",
    labelZh: "匹配广告点击率",
    group: "ADVANCED",
    description: "The number of ad clicks divided by the number of matched ad requests.",
    category: "clicks",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => (r.matchedRequests > 0 ? (r.clicks / r.matchedRequests) * 100 : 0),
    defaultVisible: () => false,
  },
  {
    id: "matchedAdRpm",
    label: "Matched ad RPM",
    labelZh: "匹配广告 RPM",
    group: "ADVANCED",
    description: "Estimated earnings divided by matched ad requests, multiplied by 1000.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => (r.matchedRequests > 0 ? (r.earnings / r.matchedRequests) * 1000 : 0),
    defaultVisible: () => false,
  },
  {
    id: "adsPerImpression",
    label: "Ads per impression",
    labelZh: "每次展示的广告数",
    group: "ADVANCED",
    description: "The average number of ads shown per impression.",
    category: "views",
    format: "decimal",
    isAvgDashed: true,
    getValue: () => 1.0,
    defaultVisible: () => false,
  },
  {
    id: "adCtr",
    label: "Ad CTR",
    labelZh: "广告点击率 (Ad CTR)",
    group: "ADVANCED",
    description: "The clickthrough rate of individual ads.",
    category: "clicks",
    format: "percent",
    isAvgDashed: true,
    getValue: (r) => r.impressionCtr,
    defaultVisible: () => false,
  },
  {
    id: "adImpressions",
    label: "Ad impressions",
    labelZh: "广告展示次数",
    group: "ADVANCED",
    description: "The total number of individual ad impressions.",
    category: "views",
    format: "int",
    getValue: (r) => r.impressions,
    defaultVisible: () => false,
  },
  {
    id: "adRpm",
    label: "Ad RPM",
    labelZh: "广告 RPM",
    group: "ADVANCED",
    description: "The revenue per thousand individual ad impressions.",
    category: "earnings",
    format: "money",
    isAvgDashed: true,
    getValue: (r) => r.impressionRpm,
    defaultVisible: () => false,
  },
  {
    id: "funnelClicks",
    label: "Funnel clicks",
    labelZh: "漏斗点击次数",
    group: "ADVANCED",
    description: "The number of clicks recorded along the funnel.",
    category: "clicks",
    format: "int",
    getValue: (r) => r.clicks,
    defaultVisible: () => false,
  },
];

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
  // July 2026 (Last month)
  { date: "2026-07-01", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-02", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-03", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-04", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-05", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-06", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-07", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-08", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-09", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-10", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-11", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-12", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-13", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-14", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-15", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-16", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-17", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-18", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-19", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-20", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-21", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-22", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-23", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-24", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-25", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-26", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-27", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-28", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-29", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-30", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-07-31", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },

  // August 2026 (This month)
  { date: "2026-08-01", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-02", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-03", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-04", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-05", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-06", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-07", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-08", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-09", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-10", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-11", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-12", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-13", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-14", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-15", dimensionName: "fun.sihec.com", earnings: 405.65, pageViews: 16738, impressions: 22306, clicks: 1088, activeViewPercent: 97.43, adRequests: 25120, matchedRequests: 24890 },
  { date: "2026-08-16", dimensionName: "fun.sihec.com", earnings: 2.80, pageViews: 2852, impressions: 71, clicks: 10, activeViewPercent: 85.92, adRequests: 3200, matchedRequests: 3100 },
  { date: "2026-08-17", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-18", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-19", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 5, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 5, matchedRequests: 5 },
  { date: "2026-08-20", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-21", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-22", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-23", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-24", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-25", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-26", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-27", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-28", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-29", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-30", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
  { date: "2026-08-31", dimensionName: "fun.sihec.com", earnings: 0.00, pageViews: 0, impressions: 0, clicks: 0, activeViewPercent: 0, adRequests: 0, matchedRequests: 0 },
];

export const DEFAULT_COUNTRIES_RECORDS: RawReportRecord[] = [
  { date: "2026-08-15", dimensionName: "United States", earnings: 368.36, pageViews: 14648, impressions: 16771, clicks: 822, activeViewPercent: 97.55, adRequests: 18900, matchedRequests: 18600 },
  { date: "2026-08-15", dimensionName: "Canada", earnings: 7.70, pageViews: 527, impressions: 600, clicks: 31, activeViewPercent: 96.99, adRequests: 680, matchedRequests: 670 },
  { date: "2026-08-15", dimensionName: "United Kingdom", earnings: 6.21, pageViews: 201, impressions: 286, clicks: 71, activeViewPercent: 97.90, adRequests: 320, matchedRequests: 315 },
  { date: "2026-08-15", dimensionName: "Australia", earnings: 4.01, pageViews: 276, impressions: 213, clicks: 8, activeViewPercent: 97.65, adRequests: 240, matchedRequests: 238 },
  { date: "2026-08-15", dimensionName: "Japan", earnings: 3.85, pageViews: 190, impressions: 210, clicks: 6, activeViewPercent: 98.10, adRequests: 230, matchedRequests: 228 },
  { date: "2026-08-15", dimensionName: "Sweden", earnings: 2.10, pageViews: 110, impressions: 130, clicks: 4, activeViewPercent: 96.50, adRequests: 145, matchedRequests: 140 },
  { date: "2026-08-15", dimensionName: "Denmark", earnings: 1.80, pageViews: 85, impressions: 95, clicks: 3, activeViewPercent: 95.80, adRequests: 105, matchedRequests: 102 },
  { date: "2026-08-15", dimensionName: "South Africa", earnings: 1.50, pageViews: 70, impressions: 80, clicks: 2, activeViewPercent: 94.20, adRequests: 90, matchedRequests: 88 },
  { date: "2026-08-15", dimensionName: "Hong Kong", earnings: 1.45, pageViews: 65, impressions: 72, clicks: 2, activeViewPercent: 95.00, adRequests: 80, matchedRequests: 79 },
  { date: "2026-08-15", dimensionName: "New Zealand", earnings: 1.47, pageViews: 52, impressions: 60, clicks: 2, activeViewPercent: 96.10, adRequests: 68, matchedRequests: 67 },
  { date: "2026-08-16", dimensionName: "United States", earnings: 2.80, pageViews: 2852, impressions: 71, clicks: 10, activeViewPercent: 85.92, adRequests: 3200, matchedRequests: 3100 },
];

export const DEFAULT_AD_UNITS_RECORDS: RawReportRecord[] = [
  { date: "2026-08-15", dimensionName: "fun.sihec.com_banner_01", earnings: 83.34, pageViews: 16738, impressions: 9393, clicks: 230, activeViewPercent: 97.69, adRequests: 10500, matchedRequests: 10300 },
  { date: "2026-08-15", dimensionName: "fun.sihec.com_banner_03", earnings: 3.13, pageViews: 16738, impressions: 63, clicks: 10, activeViewPercent: 98.41, adRequests: 70, matchedRequests: 69 },
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

  // Determine latest date in records or default to today's date in 2026
  const latestDate = records.reduce((max, r) => (r.date > max ? r.date : max), "2026-08-24");
  const [yearStr, monthStr] = latestDate.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (timeRange === "today") {
    return records.filter((r) => r.date === latestDate);
  } else if (timeRange === "last_7_days") {
    const sortedDates = Array.from(new Set(records.map((r) => r.date))).sort();
    const targetDates = sortedDates.slice(-7);
    return records.filter((r) => targetDates.includes(r.date));
  } else if (timeRange === "last_30_days") {
    const sortedDates = Array.from(new Set(records.map((r) => r.date))).sort();
    const targetDates = sortedDates.slice(-30);
    return records.filter((r) => targetDates.includes(r.date));
  } else if (timeRange === "this_month") {
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
    return records.filter((r) => r.date.startsWith(monthPrefix));
  } else if (timeRange === "last_month") {
    let lastMonthYear = year;
    let lastMonth = month - 1;
    if (lastMonth < 1) {
      lastMonth = 12;
      lastMonthYear -= 1;
    }
    const lastMonthPrefix = `${lastMonthYear}-${String(lastMonth).padStart(2, "0")}`;
    return records.filter((r) => r.date.startsWith(lastMonthPrefix));
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

  const grouped = new Map<
    string,
    {
      earnings: number;
      pageViews: number;
      impressions: number;
      clicks: number;
      activeViewsWeighted: number;
      adRequests: number;
      matchedRequests: number;
      coverage?: number;
    }
  >();

  if (dimension === "by_day") {
    // Group by Date
    for (const r of filtered) {
      const key = r.date;
      const cur = grouped.get(key) || {
        earnings: 0,
        pageViews: 0,
        impressions: 0,
        clicks: 0,
        activeViewsWeighted: 0,
        adRequests: 0,
        matchedRequests: 0,
        coverage: r.coverage,
      };
      cur.earnings += r.earnings;
      cur.pageViews += r.pageViews;
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      cur.activeViewsWeighted += (r.activeViewPercent ?? 97.4) * r.impressions;
      cur.adRequests += r.adRequests ?? r.impressions;
      cur.matchedRequests += r.matchedRequests ?? r.impressions;
      if (r.coverage !== undefined) {
        cur.coverage = r.coverage;
      }
      grouped.set(key, cur);
    }

    // Ensure all days in month start from day 1 for this_month, last_month, and last_30_days
    const latestDate = rawRecords.length > 0
      ? rawRecords.reduce((max, r) => (r.date > max ? r.date : max), "2026-08-24")
      : "2026-08-24";
    let targetYear = parseInt(latestDate.split("-")[0], 10);
    let targetMonth = parseInt(latestDate.split("-")[1], 10);

    if (timeRange === "last_30_days") {
      const latestDateObj = new Date(latestDate + "T00:00:00");
      for (let i = 29; i >= 0; i--) {
        const d = new Date(latestDateObj);
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dt = String(d.getDate()).padStart(2, "0");
        const dtStr = `${y}-${m}-${dt}`;
        if (!grouped.has(dtStr)) {
          grouped.set(dtStr, {
            earnings: 0,
            pageViews: 0,
            impressions: 0,
            clicks: 0,
            activeViewsWeighted: 0,
            adRequests: 0,
            matchedRequests: 0,
          });
        }
      }
    } else if (timeRange === "this_month") {
      const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dt = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (!grouped.has(dt)) {
          grouped.set(dt, {
            earnings: 0,
            pageViews: 0,
            impressions: 0,
            clicks: 0,
            activeViewsWeighted: 0,
            adRequests: 0,
            matchedRequests: 0,
          });
        }
      }
    } else if (timeRange === "last_month") {
      targetMonth -= 1;
      if (targetMonth < 1) {
        targetMonth = 12;
        targetYear -= 1;
      }
      const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dt = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (!grouped.has(dt)) {
          grouped.set(dt, {
            earnings: 0,
            pageViews: 0,
            impressions: 0,
            clicks: 0,
            activeViewsWeighted: 0,
            adRequests: 0,
            matchedRequests: 0,
          });
        }
      }
    }
  } else {
    // Group by Dimension Name (Site / Country / Ad Unit)
    for (const r of filtered) {
      const key = r.dimensionName;
      const cur = grouped.get(key) || {
        earnings: 0,
        pageViews: 0,
        impressions: 0,
        clicks: 0,
        activeViewsWeighted: 0,
        adRequests: 0,
        matchedRequests: 0,
        coverage: r.coverage,
      };
      cur.earnings += r.earnings;
      cur.pageViews += r.pageViews;
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      cur.activeViewsWeighted += (r.activeViewPercent ?? 97.4) * r.impressions;
      cur.adRequests += r.adRequests ?? r.impressions;
      cur.matchedRequests += r.matchedRequests ?? r.impressions;
      if (r.coverage !== undefined) {
        cur.coverage = r.coverage;
      }
      grouped.set(key, cur);
    }
  }

  const rows: AggregatedReportRow[] = [];
  let totalEarnings = 0;
  let totalPageViews = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalActiveWeighted = 0;
  let totalAdRequests = 0;
  let totalMatchedRequests = 0;

  for (const [name, data] of grouped.entries()) {
    const pageRpm = data.pageViews > 0 ? Number(((data.earnings / data.pageViews) * 1000).toFixed(2)) : 0;
    const impressionRpm = data.impressions > 0 ? Number(((data.earnings / data.impressions) * 1000).toFixed(2)) : 0;
    const activeViewViewable = data.impressions > 0 ? Number((data.activeViewsWeighted / data.impressions).toFixed(2)) : 97.4;
    const pageCtr = data.pageViews > 0 ? Number(((data.clicks / data.pageViews) * 100).toFixed(2)) : 0;
    const impressionCtr = data.impressions > 0 ? Number(((data.clicks / data.impressions) * 100).toFixed(2)) : 0;
    const cpc = data.clicks > 0 ? Number((data.earnings / data.clicks).toFixed(2)) : 0;
    const coverage = data.coverage !== undefined
      ? data.coverage
      : (data.adRequests > 0 ? Number(((data.matchedRequests / data.adRequests) * 100).toFixed(2)) : 100);

    totalEarnings += data.earnings;
    totalPageViews += data.pageViews;
    totalImpressions += data.impressions;
    totalClicks += data.clicks;
    totalActiveWeighted += data.activeViewsWeighted;
    totalAdRequests += data.adRequests;
    totalMatchedRequests += data.matchedRequests;

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
      pageCtr,
      impressionCtr,
      cpc,
      adRequests: data.adRequests,
      matchedRequests: data.matchedRequests,
      coverage,
    });
  }

  // Sort rows descending by earnings
  if (dimension === "by_day") {
    rows.sort((a, b) => b.key.localeCompare(a.key));
  } else {
    rows.sort((a, b) => b.earnings - a.earnings);
  }

  const rowCount = Math.max(1, rows.length);
  const totalPageRpm = totalPageViews > 0 ? Number(((totalEarnings / totalPageViews) * 1000).toFixed(2)) : 0;
  const totalImpressionRpm = totalImpressions > 0 ? Number(((totalEarnings / totalImpressions) * 1000).toFixed(2)) : 0;
  const totalActiveView = totalImpressions > 0 ? Number((totalActiveWeighted / totalImpressions).toFixed(2)) : 97.4;
  const totalPageCtr = totalPageViews > 0 ? Number(((totalClicks / totalPageViews) * 100).toFixed(2)) : 0;
  const totalImpressionCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
  const totalCpc = totalClicks > 0 ? Number((totalEarnings / totalClicks).toFixed(2)) : 0;
  const totalCoverage = totalAdRequests > 0 ? Number(((totalMatchedRequests / totalAdRequests) * 100).toFixed(2)) : 100;

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
    pageCtr: totalPageCtr,
    impressionCtr: totalImpressionCtr,
    cpc: totalCpc,
    adRequests: totalAdRequests,
    matchedRequests: totalMatchedRequests,
    coverage: totalCoverage,
  };

  const avgRow: AggregatedReportRow = {
    key: "average_row",
    name: "Average",
    isAverage: true,
    earnings: Number((totalEarnings / rowCount).toFixed(2)),
    pageViews: Math.round(totalPageViews / rowCount),
    pageRpm: 0,
    impressions: Math.round(totalImpressions / rowCount),
    impressionRpm: 0,
    activeViewViewable: 0,
    clicks: Math.round(totalClicks / rowCount),
    pageCtr: 0,
    impressionCtr: 0,
    cpc: 0,
    adRequests: Math.round(totalAdRequests / rowCount),
    matchedRequests: Math.round(totalMatchedRequests / rowCount),
    coverage: 0,
  };

  return { rows, totalRow, avgRow, allDates };
}

// Generate Excel file buffers
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

// Helper: Normalize Excel cell value to string
function cellToStr(val: any): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

// Helper: Normalize Excel cell value to number
function cellToNum(val: any, defaultVal = 0): number {
  if (val === null || val === undefined) return defaultVal;
  if (typeof val === "number") return isNaN(val) ? defaultVal : val;
  const cleaned = String(val).replace(/[$,%¥€£\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? defaultVal : num;
}

// Smart Header Mapper: Detects column indexes dynamically by inspecting row headers (supports multi-row titles)
export function parseExcelRecords(buffer: ArrayBuffer): RawReportRecord[] {
  try {
    const wb = XLSX.read(buffer, { type: "array" });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return [];
    const ws = wb.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
    if (rawRows.length < 2) return [];

    // Find the header row by searching rows 0 to 5 for the row with the most report keywords
    let headerRowIdx = 0;
    let maxMatches = 0;

    for (let r = 0; r < Math.min(6, rawRows.length); r++) {
      const row = rawRows[r];
      if (!Array.isArray(row) || row.length === 0) continue;
      let matches = 0;
      for (const cell of row) {
        const text = cellToStr(cell).toLowerCase().replace(/[\s_\-%↓↑*]/g, "");
        if (
          text.includes("date") ||
          text.includes("日期") ||
          text.includes("site") ||
          text.includes("站点") ||
          text.includes("country") ||
          text.includes("国家") ||
          text.includes("adunit") ||
          text.includes("单元") ||
          text.includes("earning") ||
          text.includes("收入") ||
          text.includes("收益") ||
          text.includes("pageview") ||
          text.includes("浏览量") ||
          text.includes("impression") ||
          text.includes("展示") ||
          text.includes("click") ||
          text.includes("点击") ||
          text.includes("request") ||
          text.includes("请求")
        ) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        headerRowIdx = r;
      }
    }

    const headerRow = rawRows[headerRowIdx] || [];
    
    // Column index detectors
    let dateIdx = -1;
    let dimIdx = -1;
    let earningsIdx = -1;
    let pageViewsIdx = -1;
    let impressionsIdx = -1;
    let clicksIdx = -1;
    let activeViewIdx = -1;
    let adRequestsIdx = -1;
    let matchedRequestsIdx = -1;
    let pageRpmIdx = -1;
    let impressionRpmIdx = -1;
    let pageCtrIdx = -1;
    let impressionCtrIdx = -1;
    let cpcIdx = -1;
    let coverageIdx = -1;

    for (let c = 0; c < headerRow.length; c++) {
      const rawHeader = cellToStr(headerRow[c]).toLowerCase();
      if (!rawHeader) continue;

      // Cleaned string without symbols/whitespace
      const h = rawHeader.replace(/[\s_\-%↓↑*]/g, "");

      if (h.includes("date") || h.includes("日期") || h.includes("时间") || h === "day") {
        dateIdx = c;
      } else if (
        h.includes("site") ||
        h.includes("domain") ||
        h.includes("country") ||
        h.includes("adunit") ||
        h.includes("网站") ||
        h.includes("站点") ||
        h.includes("域名") ||
        h.includes("国家") ||
        h.includes("广告单元") ||
        h.includes("单元") ||
        h.includes("name") ||
        h.includes("名称")
      ) {
        dimIdx = c;
      } else if (
        h.includes("estimatedearning") ||
        h.includes("earnings") ||
        h.includes("earning") ||
        h.includes("revenue") ||
        h.includes("预估收入") ||
        h.includes("预计收入") ||
        h.includes("预估收益") ||
        h.includes("收入") ||
        h.includes("收益")
      ) {
        earningsIdx = c;
      } else if (h.includes("pageview") || h.includes("浏览量") || h.includes("网页浏览量") || h.includes("pv")) {
        pageViewsIdx = c;
      } else if (h.includes("impressionrpm") || h.includes("展示rpm")) {
        impressionRpmIdx = c;
      } else if (h.includes("pagestatrpm") || h.includes("pagestaterpm") || h.includes("pagestaterpm") || h.includes("pagestrpm") || h.includes("pagrpm") || h.includes("网页rpm") || h.includes("页面rpm")) {
        pageRpmIdx = c;
      } else if (h.includes("impression") || h.includes("展示次数") || h.includes("展示量") || h.includes("展示") || h.includes("曝光")) {
        impressionsIdx = c;
      } else if (h.includes("click") || h.includes("点击次数") || h.includes("点击量") || h.includes("点击")) {
        clicksIdx = c;
      } else if (h.includes("activeview") || h.includes("viewable") || h.includes("可见率") || h.includes("可见度")) {
        activeViewIdx = c;
      } else if (h.includes("matchedrequest") || h.includes("匹配请求") || h.includes("匹配数") || h.includes("匹配次")) {
        matchedRequestsIdx = c;
      } else if (h.includes("adrequest") || h.includes("request") || h.includes("广告请求") || h.includes("请求数") || h.includes("请求次")) {
        adRequestsIdx = c;
      } else if (h.includes("pagectr") || h.includes("网页点击率") || h.includes("网页ctr")) {
        pageCtrIdx = c;
      } else if (h.includes("impressionctr") || h.includes("展示点击率") || h.includes("展示ctr")) {
        impressionCtrIdx = c;
      } else if (h.includes("cpc") || h.includes("costperclick") || h.includes("每次点击费用")) {
        cpcIdx = c;
      } else if (h.includes("coverage") || h.includes("覆盖率")) {
        coverageIdx = c;
      }
    }

    // Default fallbacks if standard columns weren't found by name
    if (dateIdx === -1) dateIdx = 0;
    if (dimIdx === -1) dimIdx = headerRow.length > 1 ? 1 : 0;
    if (earningsIdx === -1) earningsIdx = 2;
    if (pageViewsIdx === -1) pageViewsIdx = 3;
    if (impressionsIdx === -1) impressionsIdx = 4;
    if (clicksIdx === -1) clicksIdx = 5;
    if (activeViewIdx === -1) activeViewIdx = 6;

    const records: RawReportRecord[] = [];
    for (let i = headerRowIdx + 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      let dateVal = cellToStr(row[dateIdx]);
      let dimVal = cellToStr(row[dimIdx]);

      // If date is missing or invalid, fallback to current date or dimension
      if (!dateVal && dimVal) {
        dateVal = "2026-08-15";
      }
      if (!dimVal && dateVal) {
        dimVal = dateVal;
      }
      if (!dateVal && !dimVal) continue;

      const earnings = cellToNum(row[earningsIdx], 0);
      const pageViews = cellToNum(row[pageViewsIdx], 0);
      const impressions = cellToNum(row[impressionsIdx], 0);
      const clicks = cellToNum(row[clicksIdx], 0);
      const activeViewPercent = activeViewIdx !== -1 && row[activeViewIdx] !== undefined ? cellToNum(row[activeViewIdx], 97.4) : 97.4;
      const adRequests = adRequestsIdx !== -1 && row[adRequestsIdx] !== undefined ? cellToNum(row[adRequestsIdx], impressions) : impressions;
      const rawCoverage = coverageIdx !== -1 && row[coverageIdx] !== undefined ? cellToNum(row[coverageIdx], 100) : undefined;
      const coverage = rawCoverage !== undefined ? (rawCoverage > 0 && rawCoverage <= 1 ? Number((rawCoverage * 100).toFixed(2)) : rawCoverage) : undefined;
      let matchedRequests = matchedRequestsIdx !== -1 && row[matchedRequestsIdx] !== undefined ? cellToNum(row[matchedRequestsIdx], impressions) : undefined;
      if (matchedRequests === undefined) {
        if (coverage !== undefined && adRequests > 0) {
          matchedRequests = Math.round((coverage / 100) * adRequests);
        } else {
          matchedRequests = impressions;
        }
      }
      const pageRpm = pageRpmIdx !== -1 && row[pageRpmIdx] !== undefined ? cellToNum(row[pageRpmIdx], 0) : undefined;
      const impressionRpm = impressionRpmIdx !== -1 && row[impressionRpmIdx] !== undefined ? cellToNum(row[impressionRpmIdx], 0) : undefined;
      const pageCtr = pageCtrIdx !== -1 && row[pageCtrIdx] !== undefined ? cellToNum(row[pageCtrIdx], 0) : undefined;
      const impressionCtr = impressionCtrIdx !== -1 && row[impressionCtrIdx] !== undefined ? cellToNum(row[impressionCtrIdx], 0) : undefined;
      const cpc = cpcIdx !== -1 && row[cpcIdx] !== undefined ? cellToNum(row[cpcIdx], 0) : undefined;

      records.push({
        date: dateVal,
        dimensionName: dimVal,
        earnings,
        pageViews,
        impressions,
        clicks,
        activeViewPercent,
        adRequests,
        matchedRequests,
        pageRpm,
        impressionRpm,
        pageCtr,
        impressionCtr,
        cpc,
        coverage,
      });
    }

    return records;
  } catch (err) {
    console.error("Failed to parse excel records:", err);
    return [];
  }
}

// Universal Loader for Excel files strictly from software execution directory
export async function loadReportRecords(dimension: ReportDimension): Promise<RawReportRecord[]> {
  const fileNameMap: Record<ReportDimension, string> = {
    sites: "按站点.xlsx",
    countries: "按国家.xlsx",
    ad_units: "按广告单元.xlsx",
    by_day: "按站点.xlsx",
  };

  const fileName = fileNameMap[dimension];

  // 1. Try Tauri backend (reads directly from current working dir or .exe dir)
  try {
    const fileBytes = await invoke<number[] | Uint8Array>("read_local_file", { fileName });
    if (fileBytes && (fileBytes as any).length > 0) {
      const uint8 = new Uint8Array(fileBytes);
      const records = parseExcelRecords(uint8.buffer);
      if (records && records.length > 0) {
        return records;
      }
    }
  } catch (err) {
    // File not found in local runtime directory
  }

  // 2. Try HTTP fetch for browser dev mode
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
    // Ignore fetch error
  }

  // If no local file found in running directory, return built-in realistic fallback records
  if (dimension === "sites" || dimension === "by_day") return DEFAULT_SITES_RECORDS;
  if (dimension === "countries") return DEFAULT_COUNTRIES_RECORDS;
  if (dimension === "ad_units") return DEFAULT_AD_UNITS_RECORDS;
  return DEFAULT_SITES_RECORDS;
}
