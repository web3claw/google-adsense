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
import { UserProfilePopover } from "./UserProfilePopover";

interface ReportsPageProps {
  initialDimension?: ReportDimension;
}

const ADSENSE_LOGO_SVG_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE0IiBoZWlnaHQ9IjM1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzVGNjM2OCI+PHBhdGggZD0iTTIxMi4wNDQgMTkuNDZjLS4wNDctLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ1LS41ODEtMS4zNTMtLjg3My0yLjQyNy0uODczLS43ODIgMC0xLjQ1OS4yNDUtMi4wMzUuNzM2LS41NzUuNDktLjk3IDEuMTUtMS4xODQgMS45NzhoNi41MzJ6bS0zLjAzNiA3LjM2Yy0xLjcwMiAwLTMuMDg2LS41NjYtNC4xNS0xLjcwMS0xLjA2OC0xLjEzNS0xLjYtMi41NjgtMS42LTQuMzAxIDAtMS42NC41MTctMy4wNTEgMS41NTItNC4yMzIgMS4wMzUtMS4xODEgMi4zNTgtMS43NzEgMy45NjctMS43NzEgMS42NzEgMCAzLjAxLjU0NCA0LjAxNCAxLjYzMyAxLjAwNCAxLjA4OSAxLjUwNyAyLjU0NSAxLjUwNyA0LjM3bC0uMDI0LjM5aC04LjljLjA2MSAxLjEzNi40NDEgMi4wMzMgMS4xMzggMi42OTIuNjk4LjY2IDEuNTE0Ljk4OSAyLjQ1Ljk4OSAxLjUxOCAwIDIuNTQ1LS42NDQgMy4wODItMS45MzJsMS44ODYuNzgyYy0uMzY4Ljg3NC0uOTc0IDEuNjA3LTEuODE4IDIuMTk3LS44NDIuNTg5LTEuODc4Ljg4NS0zLjEwNC44ODV6TTE5Ny43MyAyNi44MjFjLTEuMjU3IDAtMi4yOTUtLjMwNy0zLjExNS0uOTJhNS40MzcgNS40MzcgMCAwIDEtMS44MDYtMi4zbDEuODg2LS43ODJjLjU5OCAxLjQxMSAxLjYxOCAyLjExNiAzLjA1OSAyLjExNi42NiAwIDEuMi0uMTQ1IDEuNjIyLS40MzcuNDItLjI5MS42MzItLjY3NS42MzItMS4xNTEgMC0uNzM1LS41MTMtMS4yMzMtMS41NDEtMS40OTRsLTIuMjc3LS41NTNjLS43MjEtLjE4My0xLjQwMy0uNTMyLTIuMDQ3LTEuMDQ1LS42NDMtLjUxNC0uOTY2LTEuMjA4LS45NjYtMi4wODIgMC0uOTk3LjQ0LTEuODA2IDEuMzIzLTIuNDI2Ljg4LS42MjEgMS45MjctLjkzMiAzLjEzOS0uOTMyLjk5NiAwIDEuODg2LjIyNyAyLjY2OC42NzhhMy44MjQgMy44MjQgMCAwIDEgMS42NzkgMS45NDRsLTEuODQuNzU5Yy0uNDE0LS45OTctMS4yNzItMS40OTUtMi41NzYtMS40OTUtLjYzIDAtMS4xNTcuMTMxLTEuNTg3LjM5MS0uNDMuMjYxLS42NDQuNjE0LS42NDQgMS4wNTggMCAuNjQ0LjQ5OCAxLjA4MSAxLjQ5NiAxLjMxMWwyLjIzLjUyOWMxLjA1OS4yNDUgMS44NC42NjcgMi4zNDYgMS4yNjUuNTA3LjU5OC43NTkgMS4yNzMuNzU5IDIuMDI0IDAgMS4wMTItLjQxNCAxLjg1NS0xLjI0MiAyLjUzLS44MjguNjc0LTEuODk0IDEuMDEyLTMuMTk3IDEuMDEyTTE4My4zMSAxNS4xODN2MS41NjNoLjA5MmMuMzA2LS41MzYuNzktLjk5MiAxLjQ0OS0xLjM2OGE0LjIwMiA0LjIwMiAwIDAgMSAyLjExNi0uNTYzYzEuMzk2IDAgMi40Ni40MyAzLjE5NyAxLjI4OC43MzYuODU4IDEuMTA0IDIuMDEgMS4xMDQgMy40NXY2LjloLTIuMTE2di02LjU3OWMwLTIuMDg1LS45MjgtMy4xMjgtMi43ODItMy4xMjgtLjg3NCAwLTEuNTg3LjM1LTIuMTQgMS4wNDctLjU1Mi42OTgtLjgyOCAxLjUwNi0uODI4IDIuNDI2djYuMjM0aC0yLjExNXYtMTEuMjdoMi4wMjN6TTE3Ny4yNjEgMTkuNDZjLS4wNDYtLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ0LS41ODEtMS4zNTMtLjg3My0yLjQyNi0uODczLS43ODIgMC0xLjQ2LjI0NS0yLjAzNi43MzYtLjU3NS40OS0uOTY5IDEuMTUtMS4xODQgMS45NzhoNi41MzJ6bS0zLjAzNiA3LjM2Yy0xLjcwMiAwLTMuMDg2LS41NjYtNC4xNTEtMS43MDEtMS4wNjYtMS4xMzUtMS41OTktMi41NjgtMS41OTktNC4zMDEgMC0xLjY0LjUxNy0zLjA1MSAxLjU1My00LjIzMiAxLjAzNS0xLjE4MSAyLjM1Ny0xLjc3MSAzLjk2Ny0xLjc3MSAxLjY3MSAwIDMuMDA5LjU0NCA0LjAxNCAxLjYzMyAxLjAwNCAxLjA4OSAxLjUwNiAyLjU0NSAxLjUwNiA0LjM3bC0uMDIzLjM5aC04LjkwMWMuMDYyIDEuMTM2LjQ0MSAyLjAzMyAxLjEzOSAyLjY5Mi42OTcuNjYgMS41MTMuOTg5IDIuNDQ5Ljk4OSAxLjUxOSAwIDIuNTQ1LS42NDQgMy4wODItMS45MzJsMS44ODYuNzgyYy0uMzY3Ljg3NC0uOTc0IDEuNjA3LTEuODE3IDIuMTk3LS44NDMuNTg5LTEuODc5Ljg4NS0zLjEwNS44ODV6TTE2MS40ODggMjYuODIxYy0xLjE5NSAwLTIuMzY1LS4zOTItMy41MDctMS4xNzMtMS4xNDItLjc4Mi0xLjg5LTEuODc4LTIuMjQzLTMuMjg5bDEuOTMzLS43ODJhNC40MDMgNC40MDMgMCAwIDAgMS40MTQgMi4yODhjLjcxMi42MjEgMS41MTMuOTMyIDIuNDAyLjkzMi45MjEgMCAxLjcwNi0uMjQyIDIuMzU4LS43MjUuNjUyLS40ODIuOTc4LTEuMTM4Ljk3OC0xLjk2NiAwLS45Mi0uMzI2LTEuNjI5LS45NzgtMi4xMjgtLjY1Mi0uNDk4LTEuNjgzLS45NjItMy4wOTMtMS4zOTEtMS40NTctLjQ2LTIuNTYyLTEuMDU0LTMuMzEzLTEuNzgzLS43NS0uNzI4LTEuMTI2LTEuNjU5LTEuMTI2LTIuNzk1IDAtMS4xOC40NjgtMi4yMDggMS40MDQtMy4wODIuOTM0LS44NzQgMi4xNTMtMS4zMSAzLjY1Ni0xLjMxIDEuMzk1IDAgMi41My4zNDkgMy40MDQgMS4wNDcuODc0LjY5NyAxLjQ0IDEuNDYgMS43MDIgMi4yODhsLTEuOTMyLjgwNWMtLjEzNy0uNTIxLS40OC0xLjAwNC0xLjAyMy0xLjQ0OS0uNTQ1LS40NDUtMS4yNDYtLjY2Ny0yLjEwNC0uNjY3LS44MTQgMC0xLjUwNy4yMjYtMi4wODIuNjc4LS41NzUuNDUzLS44NjMgMS4wMTctLjg2MyAxLjY5IDAgLjYxNS4yNjUgMS4xMzEuNzk0IDEuNTUzLjUyOS40MjIgMS4zMDcuODAyIDIuMzM0IDEuMTM5LjgxMy4yNjEgMS40OS41MTQgMi4wMzYuNzU5YTkuNTE0IDkuNTE0IDAgMCAxIDEuNjU2Ljk3N2MuNTU5LjQwNi45OC45MTIgMS4yNjUgMS41MTkuMjgzLjYwNS40MjUgMS4zMDYuNDI1IDIuMTA0IDAgLjc5Ny0uMTY0IDEuNTEtLjQ5NCAyLjEzOWE0LjAxOSA0LjAxOSAwIDAgMS0xLjMxMSAxLjQ5NSA2LjU4OCA2LjU4OCAwIDAgMS0zLjY5MiAxLjEyN00xNDguMzc2IDI0Ljg4OGMuOTk2IDAgMS44NDMtLjM2NyAyLjU0MS0xLjEwNC42OTctLjczNiAxLjA0Ny0xLjcyNCAxLjA0Ny0yLjk2NiAwLTEuMjQyLS4zNS0yLjIzMi0xLjA0Ny0yLjk2Ny0uNjk4LS43MzYtMS41NDUtMS4xMDUtMi41NC0xLjEwNS0uOTgyIDAtMS44MjYuMzcyLTIuNTMgMS4xMTYtLjcwNy43NDQtMS4wNiAxLjczLTEuMDYgMi45NTZzLjM1MyAyLjIxMiAxLjA2IDIuOTU1Yy43MDQuNzQ0IDEuNTQ4IDEuMTE1IDIuNTMgMS4xMTVtLS4zNDcgMS45MzNjLTEuNDU3IDAtMi43MTQtLjU3Ni0zLjc3LTEuNzI2LTEuMDYtMS4xNDktMS41ODgtMi41NzUtMS41ODgtNC4yNzdzLjUyOC0zLjEyOCAxLjU4Ny00LjI3OWMxLjA1Ny0xLjE1IDIuMzE0LTEuNzI0IDMuNzcxLTEuNzI0Ljg2IDAgMS42My4xODMgMi4zMTIuNTUyLjY4Mi4zNjggMS4xOTIuODI4IDEuNTMgMS4zOGguMDkybC0uMDkyLTEuNTY0VjkuOTg1aDIuMTE1djE2LjQ2N2gtMi4wMjN2LTEuNTY0aC0uMDkyYy0uMzM4LjU1My0uODQ4IDEuMDEzLTEuNTMgMS4zODEtLjY4My4zNjctMS40NTMuNTUyLTIuMzEyLjU1Mk0xMzEuOTc3IDIwLjAxMmg1LjQ3NWwtMi42OTItNy40MjloLS4wOTJsLTIuNjkxIDcuNDN6bS00LjY3IDYuNDRsNi4yMS0xNi40NjdoMi4zOTRsNi4yMSAxNi40NjdoLTIuMzQ2bC0xLjU4OC00LjQ2aC02LjkyM2wtMS42MSA0LjQ2aC0yLjM0NnoiLz48L2c+PGcgZmlsbD0iIzVGNjM2OCI+PHBhdGggZD0iTTExMi4xOSAyMC42MzdsNS4zNjQtMi4yMjhjLS4yOTYtLjc1LTEuMTgxLTEuMjcyLTIuMjI3LTEuMjcyLTEuMzQxIDAtMy4yMDQgMS4xODItMy4xMzcgMy41bTYuMjk2IDIuMTU5bDIuMDQ1IDEuMzYzYy0uNjU4Ljk3OC0yLjI1IDIuNjYtNSAyLjY2LTMuNDA4IDAtNS44Ny0yLjYzNy01Ljg3LTYgMC0zLjU3IDIuNDg0LTYuMDAxIDUuNTc1LTYuMDAxIDMuMTE0IDAgNC42MzcgMi40NzggNS4xMzYgMy44MTlsLjI3My42ODItOC4wMjMgMy4zMThjLjYxNCAxLjIwNSAxLjU2OCAxLjgxOCAyLjkwOSAxLjgxOCAxLjM0IDAgMi4yNzMtLjY2IDIuOTU1LTEuNjZNMTA1LjQ4NCAyNi40NTVoMi42MzZWOC44MThoLTIuNjM2ek0xMDEuMTgzIDIwLjg0MWMwLTIuMTEzLTEuNDEtMy42NTktMy4yMDUtMy42NTktMS44MTcgMC0zLjM0MSAxLjU0Ni0zLjM0MSAzLjY1OSAwIDIuMDkxIDEuNTI0IDMuNjE0IDMuMzQgMy42MTQgMS43OTYgMCAzLjIwNi0xLjUyMyAzLjIwNi0zLjYxNHptMi4zMTctNS42NTl2MTAuNzczYzAgNC40MzItMi42MTMgNi4yNTEtNS43MDQgNi4yNTEtMi45MSAwLTQuNjYtMS45NTUtNS4zMTgtMy41NDZsMi4yOTUtLjk1NWMuNDEuOTc3IDEuNDEgMi4xMzYgMy4wMjMgMi4xMzYgMS45NzcgMCAzLjIwNS0xLjIyNyAzLjIwNS0zLjUyMnYtLjg2NGgtLjA5MWMtLjU5MS43MjctMS43MjggMS4zNjQtMy4xNiAxLjM2NC0zIDAtNS43NS0yLjYxNC01Ljc1LTUuOTc4IDAtMy4zODYgMi43NS02LjAyMyA1Ljc1LTYuMDIzIDEuNDMyIDAgMi41NjkuNjM2IDMuMTYgMS4zNDFoLjA5di0uOTc3aDIuNXpNNzQuNzMgMjAuODE5YzAtMi4xNi0xLjU0LTMuNjM3LTMuMzI1LTMuNjM3LTEuNzg1IDAtMy4zMjUgMS40NzgtMy4zMjUgMy42MzcgMCAyLjEzNiAxLjU0IDMuNjM2IDMuMzI1IDMuNjM2IDEuNzg1IDAgMy4zMjUtMS41IDMuMzI1LTMuNjM2bTIuNTg4IDBjMCAzLjQ1NC0yLjY1NSA2LTUuOTEzIDYtMy4yNTggMC01LjkxMy0yLjU0Ni01LjkxMy02IDAtMy40NzggMi42NTUtNiA1LjkxMy02IDMuMjU4IDAgNS45MTMgMi41MjEgNS45MTMgNk04Ny45ODcgMjAuODE5YzAtMi4xNi0xLjU0LTMuNjM3LTMuMzI1LTMuNjM3LTEuNzg1IDAtMy4zMjUgMS40NzgtMy4zMjUgMy42MzcgMCAyLjEzNiAxLjU0IDMuNjM2IDMuMzI1IDMuNjM2IDEuNzg1IDAgMy4zMjUtMS41IDMuMzI1LTMuNjM2bTIuNTg5IDBjMCAzLjQ1NC0yLjY1NiA2LTUuOTE0IDYtMy4yNTggMC01LjkxMy0yLjU0Ni01LjkxMy02IDAtMy40NzggMi42NTUtNiA1LjkxMy02IDMuMjU4IDAgNS45MTQgMi41MjEgNS45MTQgNk01NS4zNiAyNi44MTljLTUuMTM1IDAtOS40NTQtNC4xODItOS40NTQtOS4zMTggMC01LjEzNyA0LjMxOS05LjMyIDkuNDU1LTkuMzIgMi44NDIgMCA0Ljg2NCAxLjExNSA2LjM4NyAyLjU3bC0xLjc5NiAxLjc5NWMtMS4wOTEtMS4wMjMtMi41NjgtMS44MTgtNC41OTEtMS44MTgtMy43NSAwLTYuNjgzIDMuMDIzLTYuNjgzIDYuNzczIDAgMy43NSAyLjkzMyA2Ljc3MiA2LjY4MyA2Ljc3MiAyLjQzMiAwIDMuODE4LS45NzcgNC43MDUtMS44NjQuNzI3LS43MjYgMS4yMDUtMS43NzIgMS4zODYtMy4yMDRINTUuMzZWMTYuNjZoOC41NjhjLjA5Mi40NTQuMTM3IDEgLjEzNyAxLjU5IDAgMS45MS0uNTIzIDQuMjc0LTIuMjA0IDUuOTU2LTEuNjM3IDEuNzA0LTMuNzI4IDIuNjEzLTYuNTAxIDIuNjEzIi8+PC9nPjxwYXRoIGQ9Ik0yOS4xNjcgMy45MTNINS43OTVhMi4xOTggMi4xOTggMCAwIDAtMi4xOSAyLjE5di4xODRjMC0xLjIwNS45ODUtMi4xOTEgMi4xOS0yLjE5MWgyMy4zNzJjMS4yMDUgMCAyLjE5MS45ODYgMi4xOTEgMi4xOXYtLjE4MmEyLjE5OCAyLjE5OCAwIDAgMC0yLjE5LTIuMTkxIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTIxLjY3NyA5LjA2M2MxLjQwOC0yLjQxLjU3Mi01LjQ5LTEuODY3LTYuODgyLTIuNDQtMS4zOS01LjU1OS0uNTY2LTYuOTY3IDEuODQ0YTUuNDkgNS40OSAwIDAgMC0uMTc1LjMzbC00Ljc2IDguMTQzYTYuMDA0IDYuMDA0IDAgMCAwLS4yOTIuNWwtNC45NDMgOC41MyA4LjgzMyA0Ljk1MSA0LjkxOC04LjQ1OGE0Ljg2NyA0Ljg2NyAwIDAgMCAuMjkyLS41bDQuNzYtOC4xNDRjLjA2OS0uMTAyLjEzOC0uMjA2LjIwMS0uMzE0IiBmaWxsPSIjRkJCQzA0Ii8+PHBhdGggZD0iTTExLjU0NyAyNi40NTNjLTEuNCAyLjQ0OS00LjU1OCAzLjM1LTYuOTgzIDEuOTM3LTIuNDI2LTEuNDE0LTMuMjg3LTQuNDgtMS44ODYtNi45MjggMS40MDEtMi40NDggNC41MzEtMy4zNTMgNi45NTctMS45NCAyLjQyNiAxLjQxNCAzLjMxMiA0LjQ4MyAxLjkxMiA2LjkzIiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTMwLjYwOCAxMC42NzVhNS4wNSA1LjA1IDAgMCAwLTYuODg5IDEuODRsLTUuMDQzIDguNzE0YTUuMDI0IDUuMDI0IDAgMCAwIDEuODQ2IDYuODcyIDUuMDUgNS4wNSAwIDAgMCA2Ljg5LTEuODQxbDUuMDQyLTguNzEzYTUuMDI1IDUuMDI1IDAgMCAwLTEuODQ2LTYuODcyIiBmaWxsPSIjNDI4NUY0Ii8+PC9nPjwvc3ZnPgo=";

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

const formatCustomDateRangeLabel = (startStr: string, endStr: string): string => {
  if (!startStr || !endStr) return "Aug 1 – 5, 2026";
  const startParts = startStr.split("-").map(Number);
  const endParts = endStr.split("-").map(Number);
  if (startParts.length !== 3 || endParts.length !== 3) return "Aug 1 – 5, 2026";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [sY, sM, sD] = startParts;
  const [eY, eM, eD] = endParts;

  const sMonth = months[sM - 1] || "Aug";
  const eMonth = months[eM - 1] || "Aug";

  if (sY === eY && sM === eM && sD === eD) {
    return `${sMonth} ${sD}, ${sY}`;
  }
  if (sY === eY && sM === eM) {
    return `${sMonth} ${sD} – ${eD}, ${sY}`;
  }
  if (sY === eY) {
    return `${sMonth} ${sD} – ${eMonth} ${eD}, ${sY}`;
  }
  return `${sMonth} ${sD}, ${sY} – ${eMonth} ${eD}, ${eY}`;
};

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialDimension = "sites" }) => {
  const { currencySymbol, networkDelay, updateCurrentEntry } = useBrowser();

  const [activeDimension, setActiveDimension] = useState<ReportDimension>(initialDimension);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("last_7_days");
  const [activeMetric, setActiveMetric] = useState<MetricKey>("earnings");
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>(() => {
    try {
      const saved = localStorage.getItem("adsense_custom_range");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.start && parsed.end) return parsed;
      }
    } catch (e) {}
    return {
      start: "2026-08-01",
      end: "2026-08-24",
    };
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

  // Pagination State
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reset page to 0 when filters or dimension change
  useEffect(() => {
    setPage(0);
  }, [activeDimension, timeRange, searchQuery, customRange]);

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

  // Paginated Rows calculation
  const totalRowsCount = filteredRows.length;
  const maxPage = Math.max(0, Math.ceil(totalRowsCount / pageSize) - 1);
  const startRowIndex = totalRowsCount === 0 ? 0 : page * pageSize + 1;
  const endRowIndex = Math.min((page + 1) * pageSize, totalRowsCount);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredRows, page, pageSize]);

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

  const formatCell = (col: MetricColumnDef, val: number, isAvg = false, row?: AggregatedReportRow) => {
    if (isAvg && col.isAvgDashed) return "—";
    if ((col.id === "impressionRpm" || col.id === "activeViewViewable" || col.id === "impressionCtr") && row && row.impressions === 0) {
      return "—";
    }
    if (col.id === "pageCtr" && row && row.pageViews === 0) {
      return "—";
    }
    if (col.id === "cpc" && row && row.clicks === 0) {
      return "—";
    }
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

  // Dynamic Line Chart Data for "Entire account by day"
  const sortedDailyRows = useMemo(() => {
    return [...rows]
      .filter((r) => !hiddenRowKeys.has(r.key))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [rows, hiddenRowKeys]);

  const activeMetricDef = useMemo(() => {
    return ALL_METRIC_COLUMNS.find((m) => m.id === activeMetric) || ALL_METRIC_COLUMNS[0];
  }, [activeMetric]);

  const lineMaxScale = useMemo(() => {
    if (sortedDailyRows.length === 0) return 100;
    const maxVal = Math.max(...sortedDailyRows.map((r) => activeMetricDef.getValue(r)));
    if (maxVal <= 0) return 100;
    const power = Math.pow(10, Math.floor(Math.log10(maxVal)));
    let scaled = Math.ceil((maxVal * 1.15) / power) * power;
    if (scaled < maxVal) scaled = maxVal * 1.25;
    return scaled;
  }, [sortedDailyRows, activeMetricDef]);

  const yAxisTicks = useMemo(() => {
    return [
      { y: 35, val: lineMaxScale, label: formatCell(activeMetricDef, lineMaxScale) },
      { y: 75, val: lineMaxScale * 0.75, label: formatCell(activeMetricDef, lineMaxScale * 0.75) },
      { y: 115, val: lineMaxScale * 0.5, label: formatCell(activeMetricDef, lineMaxScale * 0.5) },
      { y: 155, val: lineMaxScale * 0.25, label: formatCell(activeMetricDef, lineMaxScale * 0.25) },
      { y: 195, val: 0, label: formatCell(activeMetricDef, 0) },
    ];
  }, [lineMaxScale, activeMetricDef]);

  const svgLinePoints = useMemo(() => {
    if (sortedDailyRows.length === 0) return [];
    const count = sortedDailyRows.length;
    const left = 65;
    const width = 805;
    const bottom = 195;
    const height = 160;

    return sortedDailyRows.map((r, i) => {
      const x = count === 1 ? left + width / 2 : left + (i / (count - 1)) * width;
      const val = activeMetricDef.getValue(r);
      const y = bottom - (Math.min(val, lineMaxScale) / lineMaxScale) * height;
      return {
        x,
        y,
        row: r,
        val,
        dateKey: r.key,
        dateLabel: r.name.replace(/^[A-Za-z]+,\s*/, "").replace(/,\s*\d{4}$/, ""),
      };
    });
  }, [sortedDailyRows, activeMetricDef, lineMaxScale]);

  const polylinePointsStr = useMemo(() => {
    if (svgLinePoints.length === 0) return "65,195 870,195";
    return svgLinePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }, [svgLinePoints]);

  const peakPoint = useMemo(() => {
    if (svgLinePoints.length === 0) return null;
    let best = svgLinePoints[0];
    for (const p of svgLinePoints) {
      if (p.val > best.val) best = p;
    }
    return best;
  }, [svgLinePoints]);

  const xAxisDateTicks = useMemo(() => {
    if (sortedDailyRows.length === 0) return [];
    const count = sortedDailyRows.length;
    if (count <= 7) {
      return sortedDailyRows.map((r) => ({
        dateKey: r.key,
        label: r.name.replace(/^[A-Za-z]+,\s*/, "").replace(/,\s*\d{4}$/, ""),
      }));
    }
    const step = (count - 1) / 6;
    const result: { dateKey: string; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const idx = Math.min(count - 1, Math.round(i * step));
      const row = sortedDailyRows[idx];
      if (row && !result.some((item) => item.dateKey === row.key)) {
        result.push({
          dateKey: row.key,
          label: row.name.replace(/^[A-Za-z]+,\s*/, "").replace(/,\s*\d{4}$/, ""),
        });
      }
    }
    return result;
  }, [sortedDailyRows]);

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
      {/* 1:1 Top Header Bar (Google AdSense Logo | Reports Title, Help, Notifications, Profile Avatar) */}
      <div
        className="adsense-topbar"
        style={{
          padding: "0 24px",
          height: "48px",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            className="topbar-icon-btn"
            title="Main menu"
            style={{ width: "36px", height: "36px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <div
            style={{
              background: `url('${ADSENSE_LOGO_SVG_BASE64}') no-repeat left center/contain`,
              width: "160px",
              height: "26px",
              cursor: "pointer",
            }}
            title="Google AdSense"
          />
          <div style={{ height: "22px", width: "1px", backgroundColor: "#dadce0", margin: "0 6px" }} />
          <h1
            className="adsense-topbar-title"
            style={{
              fontSize: "18px",
              color: "#202124",
              fontWeight: 400,
              fontFamily: "Google Sans, Roboto, Arial, sans-serif",
              margin: 0,
            }}
          >
            Reports
          </h1>
        </div>
        <div className="adsense-topbar-right" style={{ position: "relative" }}>
          <button className="topbar-icon-btn" title="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#5F6368" strokeWidth="1.8" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="#5F6368" />
            </svg>
          </button>
          <button className="topbar-icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="topbar-avatar"
            title="Google Account"
            style={{ cursor: "pointer" }}
            onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
          >
            <svg width="28" height="28" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#1A73E8" />
              <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
              <circle cx="16" cy="11" r="4.5" fill="#FFF" />
            </svg>
          </div>
          <UserProfilePopover
            isOpen={isProfilePopoverOpen}
            onClose={() => setIsProfilePopoverOpen(false)}
          />
        </div>
      </div>

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
              {timeRange === "custom" && <span className="pill-check">✓</span>} {formatCustomDateRangeLabel(customRange.start, customRange.end)}
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
                    try {
                      localStorage.setItem("adsense_custom_range", JSON.stringify(customRange));
                    } catch (e) {}
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
                  <div className="sidebar-item-main">
                    <div className="sidebar-item-title-row">
                      <span
                        className="quick-report-icon"
                        role="img"
                        title="Report provided by Google"
                        aria-label="Report provided by Google"
                      />
                      <span className="sidebar-item-title">{item.name}</span>
                    </div>
                    <div className="sidebar-item-desc">{item.subtitle}</div>
                  </div>
                  {!isActive && <span className="sidebar-item-more">⋮</span>}
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
                  {/* Dynamic Grid Lines & Y Axis Labels */}
                  {yAxisTicks.map((tick) => (
                    <g key={tick.y}>
                      <line x1="60" y1={tick.y} x2="880" y2={tick.y} stroke="#f1f3f4" strokeWidth="1" />
                      <text
                        x="52"
                        y={tick.y + 4}
                        textAnchor="end"
                        fill="#70757a"
                        fontSize="11"
                        fontFamily="Roboto, Arial, sans-serif"
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}

                  {/* Real Polyline Driven by Data */}
                  <polyline
                    fill="none"
                    stroke="#1a73e8"
                    strokeWidth="2"
                    points={polylinePointsStr}
                  />

                  {/* Peak / Highlight Data Point Dot */}
                  {peakPoint && (
                    <g>
                      <circle cx={peakPoint.x} cy={peakPoint.y} r="4.5" fill="#1a73e8" />
                      <circle cx={peakPoint.x} cy={peakPoint.y} r="7.5" fill="none" stroke="#1a73e8" strokeWidth="1.5" opacity="0.4" />
                    </g>
                  )}
                </svg>

                {/* Bottom X-Axis Dates */}
                <div className="line-chart-x-axis">
                  {xAxisDateTicks.map((tick) => (
                    <span
                      key={tick.dateKey}
                      className={peakPoint && peakPoint.dateKey === tick.dateKey ? "x-active-date" : ""}
                    >
                      {tick.label}
                    </span>
                  ))}
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
                    {activeDimension !== "by_day" && (
                      <span className="eye-toggle-btn disabled" title="Total row">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#70757a">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                      </span>
                    )}
                    <span className="row-dim-name bold">{totalRow.name}</span>
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.id}
                      className={`td-col-metric align-right bold ${col.id === "earnings" ? "amount-font" : ""}`}
                    >
                      {formatCell(col, col.getValue(totalRow), false, totalRow)}
                    </td>
                  ))}
                </tr>

                {/* Average Row */}
                <tr className="tr-avg-row">
                  <td className="td-col-dim">
                    {activeDimension !== "by_day" && <span className="eye-toggle-btn invisible">👁</span>}
                    <span className="row-dim-name italic">{avgRow.name}</span>
                  </td>
                  {activeColumns.map((col) => (
                    <td
                      key={col.id}
                      className={`td-col-metric align-right italic ${col.id === "earnings" ? "amount-font" : ""}`}
                    >
                      {formatCell(col, col.getValue(avgRow), true, avgRow)}
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
                {paginatedRows.map((row: AggregatedReportRow) => {
                  const isHidden = hiddenRowKeys.has(row.key);
                  return (
                    <tr key={row.key} className={`tr-data-row ${isHidden ? "dimmed" : ""}`}>
                      <td className="td-col-dim">
                        {activeDimension !== "by_day" && (
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
                        )}
                        <span className="row-dim-name">{row.name}</span>
                      </td>
                      {activeColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`td-col-metric align-right ${col.id === "earnings" ? "amount-font" : ""}`}
                        >
                          {formatCell(col, col.getValue(row), false, row)}
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
                <span>Show rows:</span>
                <select
                  className="pagination-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <span className="pagination-info">
                  {totalRowsCount === 0 ? "0 - 0 of 0" : `${startRowIndex} - ${endRowIndex} of ${totalRowsCount}`}
                </span>

                <div className="pagination-arrows">
                  <button
                    type="button"
                    className={`page-arrow ${page === 0 ? "disabled" : ""}`}
                    disabled={page === 0}
                    onClick={() => setPage(0)}
                    title="First page"
                  >
                    |&lt;
                  </button>
                  <button
                    type="button"
                    className={`page-arrow ${page === 0 ? "disabled" : ""}`}
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    title="Previous page"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className={`page-arrow ${page >= maxPage ? "disabled" : ""}`}
                    disabled={page >= maxPage}
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                    title="Next page"
                  >
                    &gt;
                  </button>
                  <button
                    type="button"
                    className={`page-arrow ${page >= maxPage ? "disabled" : ""}`}
                    disabled={page >= maxPage}
                    onClick={() => setPage(maxPage)}
                    title="Last page"
                  >
                    &gt;|
                  </button>
                </div>
              </div>

              {activeDimension === "sites" && (
                <div className="footer-disclaimer">
                  * Estimated site earnings may be inaccurate and are only an indication of your earnings.
                </div>
              )}
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
