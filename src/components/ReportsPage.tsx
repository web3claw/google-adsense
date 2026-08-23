import React, { useEffect, useState, useMemo } from "react";
import {
  ReportDimension,
  TimeRangeKey,
  MetricKey,
  RawReportRecord,
  AggregatedReportRow,
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

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialDimension = "sites" }) => {
  const { currencySymbol, networkDelay, updateCurrentEntry } = useBrowser();

  const [activeDimension, setActiveDimension] = useState<ReportDimension>(initialDimension);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("last_7_days");
  const [activeMetric, setActiveMetric] = useState<MetricKey>("earnings");
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: "2026-08-01",
    end: "2026-08-05",
  });
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);

  const [rawRecords, setRawRecords] = useState<RawReportRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hiddenRowKeys, setHiddenRowKeys] = useState<Set<string>>(new Set());

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

    const mParam =
      activeDimension === "ad_units"
        ? "earnings%2CmonetizableImpressions%2CmonetizableImpressionsRpm%2CactiveViewViewability%2Cclicks"
        : "earnings%2CpageViews%2CpageViewsRpm%2CmonetizableImpressions%2CmonetizableImpressionsRpm%2CactiveViewViewability%2Cclicks";

    const dynamicUrl = `https://adsense.google.com/adsense/u/0/${pubId}/reporting/?rt=q&ag=${ag}&dr=${drParam}&gm=earnings&m=${mParam}&oc=${oc}&oo=${oo}&ct=${ct}`;
    const dynamicTitle = `${titleName} – Reports – Google AdSense`;

    updateCurrentEntry({
      url: dynamicUrl,
      title: dynamicTitle,
    });
  }, [activeDimension, timeRange, customRange]);

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

  // Available metrics
  const isAdUnits = activeDimension === "ad_units";
  const metricsList: { key: MetricKey; label: string }[] = isAdUnits
    ? [
        { key: "earnings", label: "Estimated earnings" },
        { key: "impressions", label: "Impressions" },
        { key: "impressionRpm", label: "Impression RPM" },
        { key: "activeViewViewable", label: "Active View Viewable" },
        { key: "clicks", label: "Clicks" },
      ]
    : [
        { key: "earnings", label: "Estimated earnings" },
        { key: "pageViews", label: "Page views" },
        { key: "pageRpm", label: "Page RPM" },
        { key: "impressions", label: "Impressions" },
        { key: "impressionRpm", label: "Impression RPM" },
        { key: "activeViewViewable", label: "Active View Viewable" },
        { key: "clicks", label: "Clicks" },
      ];

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
    return filteredRows
      .filter((r: AggregatedReportRow) => !hiddenRowKeys.has(r.key))
      .map((r: AggregatedReportRow) => {
        let val = r.earnings;
        if (activeMetric === "pageViews") val = r.pageViews;
        else if (activeMetric === "pageRpm") val = r.pageRpm;
        else if (activeMetric === "impressions") val = r.impressions;
        else if (activeMetric === "impressionRpm") val = r.impressionRpm;
        else if (activeMetric === "activeViewViewable") val = r.activeViewViewable;
        else if (activeMetric === "clicks") val = r.clicks;

        return {
          key: r.key,
          name: r.name,
          value: val,
        };
      });
  }, [filteredRows, activeMetric, hiddenRowKeys]);

  const maxChartVal = useMemo(() => {
    if (chartItems.length === 0) return 100;
    const m = Math.max(...chartItems.map((c: { value: number }) => c.value));
    if (m <= 0) return 100;
    // Round up nicely
    const power = Math.pow(10, Math.floor(Math.log10(m)));
    return Math.ceil((m * 1.15) / power) * power;
  }, [chartItems]);

  return (
    <div className="reports-root-layout">
      {/* 1:1 Top Header Bar (Google AdSense Logo | Reports Title, Help, Notifications, Profile Avatar) */}
      <div className="adsense-topbar" style={{ padding: "0 24px", height: "48px", borderBottom: "1px solid #e0e0e0", backgroundColor: "#ffffff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              background: `url('${ADSENSE_LOGO_SVG_BASE64}') no-repeat left center/contain`,
              width: "170px",
              height: "28px",
              cursor: "pointer",
            }}
            title="Google AdSense"
          />
          <div style={{ height: "24px", width: "1px", backgroundColor: "#dadce0", margin: "0 20px" }} />
          <h1 className="adsense-topbar-title" style={{ fontSize: "18px", color: "#202124", fontWeight: 400, fontFamily: "Google Sans, Roboto, Arial, sans-serif", margin: 0 }}>
            Reports
          </h1>
        </div>
        <div className="adsense-topbar-right">
          <button className="topbar-icon-btn" title="Help">
            <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px", color: "#5F6368" }}>
              help_outline
            </i>
          </button>
          <button className="topbar-icon-btn" title="Notifications">
            <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px", color: "#5F6368" }}>
              notifications_none
            </i>
          </button>
          <div
            className="topbar-avatar"
            title="Google Account"
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
          >
            <svg width="28" height="28" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#1A73E8" />
              <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
              <circle cx="16" cy="11" r="4.5" fill="#FFF" />
            </svg>

            <UserProfilePopover
              isOpen={isProfilePopoverOpen}
              onClose={() => setIsProfilePopoverOpen(false)}
            />
          </div>
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
                  onClick={() => setIsCustomDropdownOpen(false)}
                >
                  Apply Filter (应用)
                </button>
              </div>
            )}
          </div>

          <span className="reports-add-comparison">+ add comparison</span>
        </div>

        <div className="reports-top-right-tools">
          <button type="button" className="reports-gear-btn" title="Settings">
            <SettingsGearIcon />
          </button>
        </div>
      </div>

      {/* Main Body with Sidebar + Content */}
      <div className="reports-body-container">
        {/* Left Sidebar */}
        <div className="reports-sidebar">
          <div className="reports-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search reports"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="reports-search-plus" title="Add Report">+</span>
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
                  title={item.name}
                >
                  <div className="sidebar-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? "#1a73e8" : "#5f6368"}>
                      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                    </svg>
                  </div>
                  <div className="sidebar-item-texts">
                    <div className="sidebar-item-title">{item.name}</div>
                    <div className="sidebar-item-desc">{item.subtitle}</div>
                  </div>
                  <div className="sidebar-item-more">⋮</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="reports-content-area" onDoubleClick={fetchRecords} title="Double-click to reload Excel data">
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
              <span className="breakdown-add-link">+ Add</span>
            </div>

            <div className="breakdown-search-filter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
              </svg>
              <input type="text" placeholder="Search or filter your data" />
            </div>
          </div>

          {/* Metric Chips Bar */}
          <div className="reports-metrics-bar">
            <div className="metrics-chips-list">
              {metricsList.map((m) => {
                const isSelected = activeMetric === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    className={`metric-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => setActiveMetric(m.key)}
                  >
                    {isSelected && <span className="metric-chip-check">✓</span>}
                    {m.label}
                  </button>
                );
              })}
              <button type="button" className="metric-chip-pencil" title="Edit metrics">
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
                {activeMetric === "earnings"
                  ? "Estimated earnings"
                  : activeMetric === "pageViews"
                  ? "Page views"
                  : activeMetric === "pageRpm"
                  ? "Page RPM"
                  : activeMetric === "impressions"
                  ? "Impressions"
                  : activeMetric === "impressionRpm"
                  ? "Impression RPM"
                  : activeMetric === "activeViewViewable"
                  ? "Active View Viewable"
                  : "Clicks"}
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
                    strokeWidth="2.5"
                    points="70,138 200,192 330,195 460,195 590,195 720,195 850,195"
                  />
                  <circle cx="70" cy="138" r="4" fill="#1a73e8" />
                  <circle cx="200" cy="192" r="3" fill="#1a73e8" />
                </svg>

                {/* X Axis Dates */}
                <div className="line-chart-x-axis">
                  <span className="x-axis-icon">☰</span>
                  <span>Aug 15</span>
                  <span>Aug 16</span>
                  <span>Aug 17</span>
                  <span>Aug 18</span>
                  <span>Aug 19</span>
                  <span>Aug 20</span>
                  <span>Aug 21</span>
                </div>
              </div>
            ) : (
              /* Horizontal Bar Chart for Sites / Countries / Ad Units */
              <div className="reports-bar-chart-wrap">
                <div className="bar-chart-rows-list">
                  {chartItems.slice(0, 10).map((item: { key: string; name: string; value: number }) => {
                    const barPercent = Math.max(1, Math.min(100, (item.value / maxChartVal) * 100));
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
              <thead>
                <tr>
                  <th className="th-col-dim">{dimensionColName}</th>
                  <th className="th-col-metric align-right">
                    {activeDimension === "sites" ? "↓ Estimated earnings *" : "↓ Estimated earnings"}
                  </th>
                  {!isAdUnits && <th className="th-col-metric align-right">Page views</th>}
                  {!isAdUnits && <th className="th-col-metric align-right">Page RPM</th>}
                  <th className="th-col-metric align-right">Impressions</th>
                  <th className="th-col-metric align-right">Impression RPM</th>
                  <th className="th-col-metric align-right">Active View Viewable</th>
                  <th className="th-col-metric align-right">Clicks</th>
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
                  <td className="td-col-metric align-right bold amount-font">{formatMoney(totalRow.earnings)}</td>
                  {!isAdUnits && <td className="td-col-metric align-right bold">{formatInt(totalRow.pageViews)}</td>}
                  {!isAdUnits && <td className="td-col-metric align-right bold">{formatMoney(totalRow.pageRpm)}</td>}
                  <td className="td-col-metric align-right bold">{formatInt(totalRow.impressions)}</td>
                  <td className="td-col-metric align-right bold">{formatMoney(totalRow.impressionRpm)}</td>
                  <td className="td-col-metric align-right bold">{formatPercent(totalRow.activeViewViewable)}</td>
                  <td className="td-col-metric align-right bold">{formatInt(totalRow.clicks)}</td>
                </tr>

                {/* Average Row */}
                <tr className="tr-avg-row">
                  <td className="td-col-dim">
                    <span className="eye-toggle-btn invisible">👁</span>
                    <span className="row-dim-name italic">{avgRow.name}</span>
                  </td>
                  <td className="td-col-metric align-right italic amount-font">{formatMoney(avgRow.earnings)}</td>
                  {!isAdUnits && <td className="td-col-metric align-right italic">{formatInt(avgRow.pageViews)}</td>}
                  {!isAdUnits && <td className="td-col-metric align-right italic">—</td>}
                  <td className="td-col-metric align-right italic">{formatInt(avgRow.impressions)}</td>
                  <td className="td-col-metric align-right italic">—</td>
                  <td className="td-col-metric align-right italic">—</td>
                  <td className="td-col-metric align-right italic">{formatInt(avgRow.clicks)}</td>
                </tr>

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
                      <td className="td-col-metric align-right amount-font">{formatMoney(row.earnings)}</td>
                      {!isAdUnits && <td className="td-col-metric align-right">{formatInt(row.pageViews)}</td>}
                      {!isAdUnits && <td className="td-col-metric align-right">{formatMoney(row.pageRpm)}</td>}
                      <td className="td-col-metric align-right">{formatInt(row.impressions)}</td>
                      <td className="td-col-metric align-right">{formatMoney(row.impressionRpm)}</td>
                      <td className="td-col-metric align-right">{formatPercent(row.activeViewViewable)}</td>
                      <td className="td-col-metric align-right">{formatInt(row.clicks)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table Footer with Pagination & Disclaimer */}
            <div className="reports-table-footer">
              <div className="footer-pagination-wrap">
                <span className="pagination-label">Show rows:</span>
                <select defaultValue="50" className="pagination-select">
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="pagination-count">1 - {filteredRows.length} of {filteredRows.length}</span>
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
