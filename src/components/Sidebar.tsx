import React, { useState } from "react";
import { useBrowser } from "../context/BrowserContext";

// SVGs matching Google Material Symbols & Official AdSense Logo exactly
const HamburgerIcon = () => (
  <svg width="15" height="12" viewBox="0 0 18 14" fill="none">
    <path d="M0 1H18M0 7H18M0 13H18" stroke="#3c4043" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ADSENSE_LOGO_SVG_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE0IiBoZWlnaHQ9IjM1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzVGNjM2OCI+PHBhdGggZD0iTTIxMi4wNDQgMTkuNDZjLS4wNDctLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ1LS41ODEtMS4zNTMtLjg3My0yLjQyNy0uODczLS43ODIgMC0xLjQ1OS4yNDUtMi4wMzUuNzM2LS41NzUuNDktLjk3IDEuMTUtMS4xODQgMS45NzhoNi41MzJ6bS0zLjAzNiA3LjM2Yy0xLjcwMiAwLTMuMDg2LS41NjYtNC4xNS0xLjcwMS0xLjA2OC0xLjEzNS0xLjYtMi41NjgtMS42LTQuMzAxIDAtMS42NC41MTctMy4wNTEgMS41NTItNC4yMzIgMS4wMzUtMS4xODEgMi4zNTgtMS43NzEgMy45NjctMS43NzEgMS42NzEgMCAzLjAxLjU0NCA0LjAxNCAxLjYzMyAxLjAwNCAxLjA4OSAxLjUwNyAyLjU0NSAxLjUwNyA0LjM3bC0uMDI0LjM5aC04LjljLjA2MSAxLjEzNi40NDEgMi4wMzMgMS4xMzggMi42OTIuNjk4LjY2IDEuNTE0Ljk4OSAyLjQ1Ljk4OSAxLjUxOCAwIDIuNTQ1LS42NDQgMy4wODItMS45MzJsMS44ODYuNzgyYy0uMzY4Ljg3NC0uOTc0IDEuNjA3LTEuODE4IDIuMTk3LS44NDIuNTg5LTEuODc4Ljg4NS0zLjEwNC44ODV6TTE5Ny43MyAyNi44MjFjLTEuMjU3IDAtMi4yOTUtLjMwNy0zLjExNS0uOTJhNS40MzcgNS40MzcgMCAwIDEtMS44MDYtMi4zbDEuODg2LS43ODJjLjU5OCAxLjQxMSAxLjYxOCAyLjExNiAzLjA1OSAyLjExNi42NiAwIDEuMi0uMTQ1IDEuNjIyLS40MzcuNDItLjI5MS42MzItLjY3NS42MzItMS4xNTEgMC0uNzM1LS41MTMtMS4yMzMtMS41NDEtMS40OTRsLTIuMjc3LS41NTNjLS43MjEtLjE4My0xLjQwMy0uNTMyLTIuMDQ3LTEuMDQ1LS42NDMtLjUxNC0uOTY2LTEuMjA4LS45NjYtMi4wODIgMC0uOTk3LjQ0LTEuODA2IDEuMzIzLTIuNDI2Ljg4LS42MjEgMS45MjctLjkzMiAzLjEzOS0uOTMyLjk5NiAwIDEuODg2LjIyNyAyLjY2OC42NzhhMy44MjQgMy44MjQgMCAwIDEgMS42NzkgMS45NDRsLTEuODQuNzU5Yy0uNDE0LS45OTctMS4yNzItMS40OTUtMi41NzYtMS40OTUtLjYzIDAtMS4xNTcuMTMxLTEuNTg3LjM5MS0uNDMuMjYxLS42NDQuNjE0LS42NDQgMS4wNTggMCAuNjQ0LjQ5OCAxLjA4MSAxLjQ5NiAxLjMxMWwyLjIzLjUyOWMxLjA1OS4yNDUgMS44NC42NjcgMi4zNDYgMS4yNjUuNTA3LjU5OC43NTkgMS4yNzMuNzU5IDIuMDI0IDAgMS4wMTItLjQxNCAxLjg1NS0xLjI0MiAyLjUzLS44MjguNjc0LTEuODk0IDEuMDEyLTMuMTk3IDEuMDEyTTE4My4zMSAxNS4xODN2MS41NjNoLjA5MmMuMzA2LS41MzYuNzktLjk5MiAxLjQ0OS0xLjM2OGE0LjIwMiA0LjIwMiAwIDAgMSAyLjExNi0uNTYzYzEuMzk2IDAgMi40Ni40MyAzLjE5NyAxLjI4OC43MzYuODU4IDEuMTA0IDIuMDEgMS4xMDQgMy40NXY2LjloLTIuMTE2di02LjU3OWMwLTIuMDg1LS45MjgtMy4xMjgtMi43ODItMy4xMjgtLjg3NCAwLTEuNTg3LjM1LTIuMTQgMS4wNDctLjU1Mi42OTgtLjgyOCAxLjUwNi0uODI4IDIuNDI2djYuMjM0aC0yLjExNXYtMTEuMjdoMi4wMjN6TTE3Ny4yNjEgMTkuNDZjLS4wNDYtLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ0LS41ODEtMS4zNTMtLjg3My0yLjQyNi0uODczLS43ODIgMC0xLjQ2LjI0NS0yLjAzNi43MzYtLjU3NS40OS0uOTY5IDEuMTUtMS4xODQgMS45NzhoNi41MzJ6bS0zLjAzNiA3LjM2Yy0xLjcwMiAwLTMuMDg2LS41NjYtNC4xNTEtMS43MDEtMS4wNjYtMS4xMzUtMS41OTktMi41NjgtMS41OTktNC4zMDEgMC0xLjY0LjUxNy0zLjA1MSAxLjU1My00LjIzMiAxLjAzNS0xLjE4MSAyLjM1Ny0xLjc3MSAzLjk2Ny0xLjc3MSAxLjY3MSAwIDMuMDA5LjU0NCA0LjAxNCAxLjYzMyAxLjAwNCAxLjA4OSAxLjUwNiAyLjU0NSAxLjUwNiA0LjM3bC0uMDIzLjM5aC04LjkwMWMuMDYyIDEuMTM2LjQ0MSAyLjAzMyAxLjEzOSAyLjY5Mi42OTcuNjYgMS41MTMuOTg5IDIuNDQ5Ljk4OSAxLjUxOSAwIDIuNTQ1LS42NDQgMy4wODItMS45MzJsMS44ODYuNzgyYy0uMzY3Ljg3NC0uOTc0IDEuNjA3LTEuODE3IDIuMTk3LS44NDMuNTg5LTEuODc5Ljg4NS0zLjEwNS44ODV6TTE2MS40ODggMjYuODIxYy0xLjE5NSAwLTIuMzY1LS4zOTItMy41MDctMS4xNzMtMS4xNDItLjc4Mi0xLjg5LTEuODc4LTIuMjQzLTMuMjg5bDEuOTMzLS43ODJhNC40MDMgNC40MDMgMCAwIDAgMS40MTQgMi4yODhjLjcxMi42MjEgMS41MTMuOTMyIDIuNDAyLjkzMi45MjEgMCAxLjcwNi0uMjQyIDIuMzU4LS43MjUuNjUyLS40ODIuOTc4LTEuMTM4Ljk3OC0xLjk2NiAwLS45Mi0uMzI2LTEuNjI5LS45NzgtMi4xMjgtLjY1Mi0uNDk4LTEuNjgzLS45NjItMy4wOTMtMS4zOTEtMS40NTctLjQ2LTIuNTYyLTEuMDU0LTMuMzEzLTEuNzgzLS43NS0uNzI4LTEuMTI2LTEuNjU5LTEuMTI2LTIuNzk1IDAtMS4xOC40NjgtMi4yMDggMS40MDQtMy4wODIuOTM0LS44NzQgMi4xNTMtMS4zMSAzLjY1Ni0xLjMxIDEuMzk1IDAgMi41My4zNDkgMy40MDQgMS4wNDcuODc0LjY5NyAxLjQ0IDEuNDYgMS43MDIgMi4yODhsLTEuOTMyLjgwNWMtLjEzNy0uNTIxLS40OC0xLjAwNC0xLjAyMy0xLjQ0OS0uNTQ1LS40NDUtMS4yNDYtLjY2Ny0yLjEwNC0uNjY3LS44MTQgMC0xLjUwNy4yMjYtMi4wODIuNjc4LS41NzUuNDUzLS44NjMgMS4wMTctLjg2MyAxLjY5IDAgLjYxNS4yNjUgMS4xMzEuNzk0IDEuNTUzLjUyOS40MjIgMS4zMDcuODAyIDIuMzM0IDEuMTM5LjgxMy4yNjEgMS40OS41MTQgMi4wMzYuNzU5YTkuNTE0IDkuNTE0IDAgMCAxIDEuNjU2Ljk3N2MuNTU5LjQwNi45OC45MTIgMS4yNjUgMS41MTkuMjgzLjYwNS40MjUgMS4zMDYuNDI1IDIuMTA0IDAgLjc5Ny0uMTY0IDEuNTEtLjQ5NCAyLjEzOWE0LjAxOSA0LjAxOSAwIDAgMS0xLjMxMSAxLjQ5NSA2LjU4OCA2LjU4OCAwIDAgMS0zLjY5MiAxLjEyN00xNDguMzc2IDI0Ljg4OGMuOTk2IDAgMS44NDMtLjM2NyAyLjU0MS0xLjEwNC42OTctLjczNiAxLjA0Ny0xLjcyNCAxLjA0Ny0yLjk2NiAwLTEuMjQyLS4zNS0yLjIzMi0xLjA0Ny0yLjk2Ny0uNjk4LS43MzYtMS41NDUtMS4xMDUtMi41NC0xLjEwNS0uOTgyIDAtMS44MjYuMzcyLTIuNTMgMS4xMTYtLjcwNy43NDQtMS4wNiAxLjczLTEuMDYgMi45NTZzLjM1MyAyLjIxMiAxLjA2IDIuOTU1Yy43MDQuNzQ0IDEuNTQ4IDEuMTE1IDIuNTMgMS4xMTVtLS4zNDcgMS45MzNjLTEuNDU3IDAtMi43MTQtLjU3Ni0zLjc3LTEuNzI2LTEuMDYtMS4xNDktMS41ODgtMi41NzUtMS41ODgtNC4yNzdzLjUyOC0zLjEyOCAxLjU4Ny00LjI3OWMxLjA1Ny0xLjE1IDIuMzE0LTEuNzI0IDMuNzcxLTEuNzI0Ljg2IDAgMS42My4xODMgMi4zMTIuNTUyLjY4Mi4zNjggMS4xOTIuODI4IDEuNTMgMS4zOGguMDkybC0uMDkyLTEuNTY0VjkuOTg1aDIuMTE1djE2LjQ2N2gtMi4wMjN2LTEuNTY0aC0uMDkyYy0uMzM4LjU1My0uODQ4IDEuMDEzLTEuNTMgMS4zODEtLjY4My4zNjctMS40NTMuNTUyLTIuMzEyLjU1Mk0xMzEuOTc3IDIwLjAxMmg1LjQ3NWwtMi42OTItNy40MjloLS4wOTJsLTIuNjkxIDcuNDN6bS00LjY3IDYuNDRsNi4yMS0xNi40NjdoMi4zOTRsNi4yMSAxNi40NjdoLTIuMzQ2bC0xLjU4OC00LjQ2aC02LjkyM2wtMS42MSA0LjQ2aC0yLjM0NnoiLz48L2c+PGcgZmlsbD0iIzVGNjM2OCI+PHBhdGggZD0iTTExMi4xOSAyMC42MzdsNS4zNjQtMi4yMjhjLS4yOTYtLjc1LTEuMTgxLTEuMjcyLTIuMjI3LTEuMjcyLTEuMzQxIDAtMy4yMDQgMS4xODItMy4xMzcgMy41bTYuMjk2IDIuMTU5bDIuMDQ1IDEuMzYzYy0uNjU4Ljk3OC0yLjI1IDIuNjYtNSAyLjY2LTMuNDA4IDAtNS44Ny0yLjYzNy01Ljg3LTYgMC0zLjU3IDIuNDg0LTYuMDAxIDUuNTc1LTYuMDAxIDMuMTE0IDAgNC42MzcgMi40NzggNS4xMzYgMy44MTlsLjI3My42ODItOC4wMjMgMy4zMThjLjYxNCAxLjIwNSAxLjU2OCAxLjgxOCAyLjkwOSAxLjgxOCAxLjM0IDAgMi4yNzMtLjY2IDIuOTU1LTEuNjZNMTA1LjQ4NCAyNi40NTVoMi42MzZWOC44MThoLTIuNjM2ek0xMDEuMTgzIDIwLjg0MWMwLTIuMTEzLTEuNDEtMy42NTktMy4yMDUtMy42NTktMS44MTcgMC0zLjM0MSAxLjU0Ni0zLjM0MSAzLjY1OSAwIDIuMDkxIDEuNTI0IDMuNjE0IDMuMzQgMy42MTQgMS43OTYgMCAzLjIwNi0xLjUyMyAzLjIwNi0zLjYxNHptMi4zMTctNS42NTl2MTAuNzczYzAgNC40MzItMi42MTMgNi4yNTEtNS43MDQgNi4yNTEtMi45MSAwLTQuNjYtMS45NTUtNS4zMTgtMy41NDZsMi4yOTUtLjk1NWMuNDEuOTc3IDEuNDEgMi4xMzYgMy4wMjMgMi4xMzYgMS45NzcgMCAzLjIwNS0xLjIyNyAzLjIwNS0zLjUyMnYtLjg2NGgtLjA5MWMtLjU5MS43MjctMS43MjggMS4zNjQtMy4xNiAxLjM2NC0zIDAtNS43NS0yLjYxNC01Ljc1LTUuOTc4IDAtMy4zODYgMi43NS02LjAyMyA1Ljc1LTYuMDIzIDEuNDMyIDAgMi41NjkuNjM2IDMuMTYgMS4zNDFoLjA5di0uOTc3aDIuNXpNNzQuNzMgMjAuODE5YzAtMi4xNi0xLjU0LTMuNjM3LTMuMzI1LTMuNjM3LTEuNzg1IDAtMy4zMjUgMS40NzgtMy4zMjUgMy42MzcgMCAyLjEzNiAxLjU0IDMuNjM2IDMuMzI1IDMuNjM2IDEuNzg1IDAgMy4zMjUtMS41IDMuMzI1LTMuNjM2bTIuNTg4IDBjMCAzLjQ1NC0yLjY1NSA2LTUuOTEzIDYtMy4yNTggMC01LjkxMy0yLjU0Ni01LjkxMy02IDAtMy40NzggMi42NTUtNiA1LjkxMy02IDMuMjU4IDAgNS45MTMgMi41MjEgNS45MTMgNk04Ny45ODcgMjAuODE5YzAtMi4xNi0xLjU0LTMuNjM3LTMuMzI1LTMuNjM3LTEuNzg1IDAtMy4zMjUgMS40NzgtMy4zMjUgMy42MzcgMCAyLjEzNiAxLjU0IDMuNjM2IDMuMzI1IDMuNjM2IDEuNzg1IDAgMy4zMjUtMS41IDMuMzI1LTMuNjM2bTIuNTg5IDBjMCAzLjQ1NC0yLjY1NiA2LTUuOTE0IDYtMy4yNTggMC01LjkxMy0yLjU0Ni01LjkxMy02IDAtMy40NzggMi42NTUtNiA1LjkxMy02IDMuMjU4IDAgNS45MTQgMi41MjEgNS45MTQgNk01NS4zNiAyNi44MTljLTUuMTM1IDAtOS40NTQtNC4xODItOS40NTQtOS4zMTggMC01LjEzNyA0LjMxOS05LjMyIDkuNDU1LTkuMzIgMi44NDIgMCA0Ljg2NCAxLjExNSA2LjM4NyAyLjU3bC0xLjc5NiAxLjc5NWMtMS4wOTEtMS4wMjMtMi41NjgtMS44MTgtNC41OTEtMS44MTgtMy43NSAwLTYuNjgzIDMuMDIzLTYuNjgzIDYuNzczIDAgMy43NSAyLjkzMyA2Ljc3MiA2LjY4MyA2Ljc3MiAyLjQzMiAwIDMuODE4LS45NzcgNC43MDUtMS44NjQuNzI3LS43MjYgMS4yMDUtMS43NzIgMS4zODYtMy4yMDRINTUuMzZWMTYuNjZoOC41NjhjLjA5Mi40NTQuMTM3IDEgLjEzNyAxLjU5IDAgMS45MS0uNTIzIDQuMjc0LTIuMjA0IDUuOTU2LTEuNjM3IDEuNzA0LTMuNzI4IDIuNjEzLTYuNTAxIDIuNjEzIi8+PC9nPjxwYXRoIGQ9Ik0yOS4xNjcgMy45MTNINS43OTVhMi4xOTggMi4xOTggMCAwIDAtMi4xOSAyLjE5di4xODRjMC0xLjIwNS45ODUtMi4xOTEgMi4xOS0yLjE5MWgyMy4zNzJjMS4yMDUgMCAyLjE5MS45ODYgMi4xOTEgMi4xOXYtLjE4MmEyLjE5OCAyLjE5OCAwIDAgMC0yLjE5LTIuMTkxIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTIxLjY3NyA5LjA2M2MxLjQwOC0yLjQxLjU3Mi01LjQ5LTEuODY3LTYuODgyLTIuNDQtMS4zOS01LjU1OS0uNTY2LTYuOTY3IDEuODQ0YTUuNDkgNS40OSAwIDAgMC0uMTc1LjMzbC00Ljc2IDguMTQzYTYuMDA0IDYuMDA0IDAgMCAwLS4yOTIuNWwtNC45NDMgOC41MyA4LjgzMyA0Ljk1MSA0LjkxOC04LjQ1OGE0Ljg2NyA0Ljg2NyAwIDAgMCAuMjkyLS41bDQuNzYtOC4xNDRjLjA2OS0uMTAyLjEzOC0uMjA2LjIwMS0uMzE0IiBmaWxsPSIjRkJCQzA0Ii8+PHBhdGggZD0iTTExLjU0NyAyNi40NTNjLTEuNCAyLjQ0OS00LjU1OCAzLjM1LTYuOTgzIDEuOTM3LTIuNDI2LTEuNDE0LTMuMjg3LTQuNDgtMS44ODYtNi45MjggMS40MDEtMi40NDggNC41MzEtMy4zNTMgNi45NTctMS45NCAyLjQyNiAxLjQxNCAzLjMxMiA0LjQ4MyAxLjkxMiA2LjkzIiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTMwLjYwOCAxMC42NzVhNS4wNSA1LjA1IDAgMCAwLTYuODg5IDEuODRsLTUuMDQzIDguNzE0YTUuMDI0IDUuMDI0IDAgMCAwIDEuODQ2IDYuODcyIDUuMDUgNS4wNSAwIDAgMCA2Ljg5LTEuODQxbDUuMDQyLTguNzEzYTUuMDI1IDUuMDI1IDAgMCAwLTEuODQ2LTYuODcyIiBmaWxsPSIjNDI4NUY0Ii8+PC9nPjwvc3ZnPgo=";

const AdSenseFullLogo = () => (
  <a
    aria-label="Google AdSense"
    className="header-logo"
    role="link"
    href="#home"
    style={{
      fontFamily: "Google Sans, Roboto, Arial, sans-serif",
      lineHeight: "1.5rem",
      fontSize: "1.125rem",
      letterSpacing: 0,
      fontWeight: 400,
      objectFit: "contain",
      background: `url('${ADSENSE_LOGO_SVG_BASE64}') no-repeat left center/contain`,
      width: "190px",
      height: "32px",
      display: "block",
      marginLeft: "0px",
    }}
  />
);

const ChevronRight = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Menu Icons (Ultra Compact 16px)
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AdsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 8h4v4H7z" />
    <path d="M15 8h2M15 12h2M7 16h10" />
  </svg>
);

const SitesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const PrivacyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    <path d="M12 14c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" />
  </svg>
);

const BrandSafetyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 17v-4M12 17V7M17 17v-7" />
  </svg>
);

const OptimizationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const PolicyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const PaymentsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6" cy="15" r="1" fill="currentColor" />
  </svg>
);

const DotIcon = ({ active }: { active?: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={active ? "#1A73E8" : "#5F6368"}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const AccountIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FeedbackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const { currentEntry, navigateTo } = useBrowser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paymentsExpanded, setPaymentsExpanded] = useState(true);
  const [brandSafetyExpanded, setBrandSafetyExpanded] = useState(false);
  const [optimizationExpanded, setOptimizationExpanded] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(false);

  const activePageId = currentEntry.pageId;

  // Auto-collapse sidebar ONLY when on Reports page, and expand when on others
  React.useEffect(() => {
    if (activePageId === "reports" || activePageId === "earnings") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [activePageId]);

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

  const handleNav = (pageId: string, title: string, path: string) => {
    const pubId = getActivePubId();
    navigateTo({
      title: `${title} – Google AdSense`,
      url: `https://adsense.google.com/adsense/u/0/${pubId}/${path}`,
      pageId,
    });
  };

  return (
    <aside className={`adsense-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Top Header Section */}
      <div className="sidebar-header">
        <button
          className="sidebar-hamburger-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle Navigation Menu"
        >
          <HamburgerIcon />
        </button>
        {!isCollapsed && (
          <>
            <AdSenseFullLogo />
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {/* Group 1 */}
        <div className="sidebar-group">
          <div
            className={`sidebar-item ${activePageId === "home" ? "active" : ""}`}
            onClick={() => handleNav("home", "Home", "home")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><HomeIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Home</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "ads" ? "active" : ""}`}
            onClick={() => handleNav("ads", "Ads", "ads/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><AdsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Ads</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "sites-list" || activePageId === "site-detail" ? "active" : ""}`}
            onClick={() => handleNav("sites-list", "Sites", "sites/list")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><SitesIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Sites</span>}
            </div>
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Group 2 */}
        <div className="sidebar-group">
          <div
            className={`sidebar-item ${activePageId === "privacy" ? "active" : ""}`}
            onClick={() => handleNav("privacy", "Privacy & messaging", "privacy/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><PrivacyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Privacy & messaging</span>}
            </div>
          </div>

          <div
            className={`sidebar-item expandable ${isCollapsed && activePageId === "brand-safety" ? "active" : ""}`}
            onClick={() => {
              if (isCollapsed) {
                handleNav("brand-safety", "Brand safety", "brand-safety/overview");
              } else {
                setBrandSafetyExpanded(!brandSafetyExpanded);
              }
            }}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {brandSafetyExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><BrandSafetyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Brand safety</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "earnings" || activePageId === "reports" ? "active" : ""}`}
            onClick={() => handleNav("reports", "Sites – Reports", "reporting/?rt=q&ag=site&dr=last7days&gm=earnings&m=earnings%2CpageViews%2CpageViewsRpm%2CmonetizableImpressions%2CmonetizableImpressionsRpm%2CactiveViewViewability%2Cclicks&oc=earnings&oo=descending&ct=b")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><ReportsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Reports</span>}
            </div>
          </div>

          <div
            className={`sidebar-item expandable ${isCollapsed && activePageId === "optimization" ? "active" : ""}`}
            onClick={() => {
              if (isCollapsed) {
                handleNav("optimization", "Optimization", "optimization/opportunities");
              } else {
                setOptimizationExpanded(!optimizationExpanded);
              }
            }}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {optimizationExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><OptimizationIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Optimization</span>}
            </div>
          </div>

          <div
            className={`sidebar-item ${activePageId === "policy" ? "active" : ""}`}
            onClick={() => handleNav("policy", "Policy center", "policy/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><PolicyIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Policy center</span>}
            </div>
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Group 3 */}
        <div className="sidebar-group">
          {/* Payments Group */}
          <div
            className={`sidebar-item expandable ${isCollapsed && (activePageId === "payments-info" || activePageId === "transactions-service" || activePageId === "verification-check") ? "active" : ""}`}
            onClick={() => {
              if (isCollapsed) {
                handleNav("payments-info", "Payments info – Payments", "payments");
              } else {
                setPaymentsExpanded(!paymentsExpanded);
                if (!paymentsExpanded) {
                  handleNav("payments-info", "Payments info – Payments", "payments");
                }
              }
            }}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {paymentsExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><PaymentsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Payments</span>}
            </div>
          </div>

          {/* Payments Sub-items */}
          {paymentsExpanded && !isCollapsed && (
            <div className="sidebar-subgroup">
              <div
                className={`sidebar-item subitem ${activePageId === "payments-info" || activePageId === "transactions-service" ? "active" : ""}`}
                onClick={() => handleNav("payments-info", "Payments info – Payments", "payments")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "payments-info" || activePageId === "transactions-service"} /></span>
                  <span className="sidebar-label">Payments info</span>
                </div>
              </div>

              <div
                className={`sidebar-item subitem ${activePageId === "verification-check" ? "active" : ""}`}
                onClick={() => handleNav("verification-check", "Verification check – Payments", "payments/verification")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "verification-check"} /></span>
                  <span className="sidebar-label">Verification check</span>
                </div>
              </div>
            </div>
          )}

          {/* Account Group */}
          <div
            className={`sidebar-item expandable ${isCollapsed && (activePageId === "settings" || activePageId === "account") ? "active" : ""}`}
            onClick={() => {
              if (isCollapsed) {
                handleNav("account", "Account", "account/settings");
              } else {
                setAccountExpanded(!accountExpanded);
              }
            }}
          >
            <div className="sidebar-item-content">
              {!isCollapsed && (
                <span className="expand-arrow">
                  {accountExpanded ? <ChevronDown /> : <ChevronRight />}
                </span>
              )}
              <span className="sidebar-icon"><AccountIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Account</span>}
            </div>
          </div>

          {/* Account Sub-items */}
          {accountExpanded && !isCollapsed && (
            <div className="sidebar-subgroup">
              <div
                className={`sidebar-item subitem ${activePageId === "settings" ? "active" : ""}`}
                onClick={() => handleNav("settings", "Account Settings", "settings/account")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "settings"} /></span>
                  <span className="sidebar-label">Access & authorization</span>
                </div>
              </div>
            </div>
          )}

          <div
            className={`sidebar-item ${activePageId === "feedback" ? "active" : ""}`}
            onClick={() => handleNav("feedback", "Feedback", "feedback")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><FeedbackIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Feedback</span>}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};
