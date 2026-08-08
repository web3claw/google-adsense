import React, { useState } from "react";
import { useBrowser } from "../context/BrowserContext";

// SVGs matching Google Material Symbols & Official AdSense Logo exactly
const HamburgerIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <path d="M0 1H18M0 7H18M0 13H18" stroke="#3c4043" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ADSENSE_LOGO_SVG_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjE0IiBoZWlnaHQ9IjM1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzVGNjM2OCI+PHBhdGggZD0iTTIxMi4wNDQgMTkuNDZjLS4wNDctLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ1LS41ODEtMS4zNTMtLjg3My0yLjQyNy0uODczLS43ODIgMC0xLjQ1OS4yNDUtMi4wMzUuNzM2LS41NzUuNDktLjk3IDEuMTUtMS4xODQgMS45NzhoNi41MzJ6bS0zLjAzNiA3LjM2Yy0xLjcwMiAwLTMuMDg2LS41NjYtNC4xNS0xLjcwMS0xLjA2OC0xLjEzNS0xLjYtMi41NjgtMS42LTQuMzAxIDAtMS42NC41MTctMy4wNTEgMS41NTItNC4yMzIgMS4wMzUtMS4xODEgMi4zNTgtMS43NzEgMy45NjctMS43NzEgMS42NzEgMCAzLjAxLjU0NCA0LjAxNCAxLjYzMyAxLjAwNCAxLjA4OSAxLjUwNyAyLjU0NSAxLjUwNyA0LjM3bC0uMDI0LjM5aC04LjljLjA2MSAxLjEzNi40NDEgMi4wMzMgMS4xMzggMi42OTIuNjk4LjY2IDEuNTE0Ljk4OSAyLjQ1Ljk4OSAxLjUxOCAwIDIuNTQ1LS42NDQgMy4wODItMS45MzJsMS44ODYuNzgyYy0uMzY4Ljg3NC0uOTc0IDEuNjA3LTEuODE4IDIuMTk3LS44NDIuNTg5LTEuODc4Ljg4NS0zLjEwNC44ODV6TTE5Ny43MyAyNi44MjFjLTEuMjU3IDAtMi4yOTUtLjMwNy0zLjExNS0uOTJhNS40MzcgNS40MzcgMCAwIDEtMS44MDYtMi4zbDEuODg2LS43ODJjLjU5OCAxLjQxMSAxLjYxOCAyLjExNiAzLjA1OSAyLjExNi42NiAwIDEuMi0uMTQ1IDEuNjIyLS40MzcuNDItLjI5MS4zcTItLjY3NS42MzItMS4xNTEgMC0uNzM1LS41MTMtMS4yMzMtMS41NDEtMS40OTRsLTIuMjc3LS41NTNjLS43MjEtLjE4My0xLjQwMy0uNTcyLTIuMDQ3LTEuMDQ1LS42NDMtLjUxNC0uOTY2LTEuMjA4LS45NjYtMi4wODIgMC0uOTk3LjQ0LTEuODA2IDEuMzIzLTIuNDI2Ljg4LS42MjEgMS45MjctLjkzMiAzLjEzOS0uOTMyLjk5NiAwIDEuODg2LjIyNyAyLjY2OC42NzhhMy44MjQgMy44MjQgMCAwIDEgMS42NzkgMS45NDRsLTEuODQuNzU5Yy0uNDE0LS45OTctMS4yNzItMS40OTUtMi41NzYtMS40OTUtLjYzIDAtMS41Ny4xMzEtMS41ODcuMzkxLS40My4yNjEtLjY0NC42MTQtLTY0NCAxLjA1OCAwIC42NDQuNDk4IDEuMDgxIDEuNDk2IDEuMzExbDIuMzAuNTI5YzEuMDU5LjI0NSAxLjg0LjY2NyAyLjM0NiAxLjI2NS41MDcuNTk4Ljc1OSAxLjI3My43NTkgMi4wMjQgMCAxLjAxMi0uNDE0IDEuODU1LTEuMjQyIDIuNTMtLjg4Ljc0LTEuODk0IDEuMDEyLTMuMTk3IDEuMDEyTTE4My4zMSAxNS4xODN2MS41NjNoLjA5MmMuMzA2LS41MzYuNzktLjk5MiAxLjQ0OS0xLjM2OGE0LjIwMiA0LjIwMiAwIDAgMSAyLjExNi0uNTYzYzEuMzk2IDAgMi40Ni40MyAzLjE5NyAxLjI4OC43MzYuODU4IDEuMTA0IDIuMDEgMS4xMDQgMy40NXY2LjloLTIuMTE2di02LjU3OWMwLTIuMDg1LS45MjgtMy4xMjgtMi43ODItMy4xMjgtLjg3NCAwLTEuNTg3LjM1LTIuMTQgMS4wNDctLjU1Mi42OTgtLjgyOCAxLjUwNi0uODI4IDIuNDI2djYuMjM0aC0yLjExNXYtMTEuMjdoMi4wMjN6TTE3Ny4yNjEgMTkuNDZjLS4wNDYtLjY0My0uMzQyLTEuMjU2LS44ODYtMS44NC0uNTQ0LS41ODEtMS4zNTMtLjg3My0yLjQyNi0uODczLS43ODIgMC0xLjQ2LjI0NS0yLjA2LjczNi0uNTc1LjQ5LS45NjkgMS4xNS0xLjE4NCAxLjk3OGg2LjUzMnptLTMuMDM2IDcuMzZjLTEuNzAyIDAtMy4wODYtLjU2Ni00LjE1MS0xLjcwMS0xLjA2Ni0xLjEzNS0xLjU5OS0yLjU2OC0xLjU5OS00LjMwMSAwLTEuNjQuNTE3LTMuMDUxIDEuNTUzLTQuMjMyIDEuMDM1LTEuMTgxIDIuMzU3LTEuNzcxIDMuOTY3LTEuNzcxIDEuNjcxIDAgMy4wMDkuNTQ0IDQuMDE0IDEuNjMzIDEuMDA0IDEuMDg5IDEuNTA2IDIuNTQ1IDEuNTA2IDQuMzdsLS4wMjMuMzlhLTguOTAxYy4wNjIgMS4xMzYuNDQxIDIuMDMzIDEuMTM5IDIuNjkyLjY5Ny42NiAxLjUxMy45ODkgMi40NDkuOTg5IDEuNTE5IDAgMi41NDUtLjY0NCAzLjA4Mi0xLjkzMmwxLjg4Ni43ODJjLS4zNjcuODc0LS45NzQgMS42MDctMS44MTcgMi4xOTctLjg0My41ODktMS44NzkuODg1LTMuMTA1Ljg4NXpNMTYxLjQ4OCAyNi44MjFjLTEuMTk1IDAtMi4zNjUtLjM5Mi0zLjUwNy0xLjE3My0xLjE0Mi0uNzgyLTEuODktMS44NzgtMi4yNDMtMy4yODlsMS45MzMtLjc4MmE0LjQwMyA0LjQwMyAwIDAgMCAxLjQxNCAyLjI4OGMuNzEyLjYyMSAxLjUxMy45MzIgMi40MDIuOTMyLjkyMSAwIDEuNzA2LS4yNDIgMi4zNTgtLjcyNS42NTItLjQ4Mi45NzgtMS4xMzguOTc4LTEuOTY2IDAtLjkyLS4zMjYtMS42MjktLjk3OC0yLjEyOC0uNjUyLS40OTgtMS42ODMtLjk2Mi0zLjA5My0xLjM5MS0xLjQ1Ny0uNDYtMi41NjItMS4wNTQtMy4zMTMtMS43ODMtLjc1LS43MjgtMS4xMjYtMS42NTktMS4xMjYtMi43OTUgMC0xLjE4LjQ2OC0yLjIwOCAxLjQwNC0zLjA4Mi45MzQtLjg3NCAyLjE1My0xLjMxIDMuNjU2LTEuMzEgMS4zOTUgMCAyLjUzLjM0OSAzLjQwNCAxLjA0Ny44NzQuNjk3IDEuNDQgMS40NiAxLjcwMiAyLjI4OGwtMS45MzIuODA1Yy0uMTM3LS41MjEtLjQ4LTEuMDA0LTEuMDIzLTEuNDQ5LS41NDUtLjQ0NS0xLjI0Ni0uNjY3LTIuMTA0LS42NjctLjgxNCAwLTEuNTA3LjIyNi0yLjA4Mi42NzgtLjU3NS40NTMtLjg2MyAxLjAxNy0uODYzIDEuNjkgMCAuNjE1LjI2NSAxLjEzMS43OTQgMS41NTMuNTI5LjQyMiAxLjMwNy44MDIgMi4zMzQgMS4xMzkuODEzLjI2MSAxLjQ5LjUxNCAyLjAzNi43NTlhOS41MTQgOS41MTQgMCAwIDEgMS42NTYuOTc3Yy41NTkuNDA2Ljk4LjkxMiAxLjI2NSAxLjUxOS4yODMuNjA1LjQyNSAxLjMwNi40MjUgMi4xMDQgMCAuNzk3LS4xNjQgMS41MS0uNDk0IDIuMTM5YTQuMDE5IDQuMDE5IDAgMCAxLTEuMzExIDEuNDk1IDYuNTg4IDYuNTg4IDAgMCAxLTMuNjkyIDEuMTI3TTE0OC4zNzYgMjQuODg4Yy45OTYgMCAxLjg0My0uMzY3IDIuNTQxLTEuMTA0LjY5Ny0uNzM2IDEuMDQ3LTEuNzI0IDEuMDQ3LTIuOTY2IDAtMS4yNDItLjM1LTIuMjMyLTEuMDQ3LTIuOTY3LS42OTgtLjczNi0xLjU0NS0xLjEwNS0yLjU0LTEuMTA1LS45ODIgMC0xLjgyNi4zNzItMi41MyAxLjExNi0uNzA3Ljc0NC0xLjA2IDEuNzMtMS4wNiAyLjk1NnMuMzUzIDIuMjEyIDEuMDYgMi45NTVjLjcwNC43NDQgMS41NDggMS4xMTUgMi41MyAxLjExNW0tLjM0NyAxLjkzM2MtMS40NTcgMC0yLjcxNC0uNTc2LTMuNzctMS43MjYtMS4wNi0xLjE0OS0xLjU4OC0yLjU3NS0xLjU4OC00LjI3N3MuNTI4LTMuMTI4IDEuNTg3LTQuMjc5YzEuMDU3LTEuMTUgMi4zMTQtMS43MjQgMy43NzEtMS43MjQuODYgMCAxLjYzLjE4MyAyLjMxMi41NTIuNjgyLjM2OCAxLjE5Mi44MjggMS41MyAxLjM4aC4wOTJsLS4wOTItMS41NjRWOS45ODVoMi4xMTV2MTYuNDY3aC0yLjAyM3YtMS41NjRoLS4wOTJjLS4zMzguNTUzLS44NDggMS4wMTMtMS41MyAxLjM4MS0uNjgzLjM2Ny0xLjQ1My41NTItMi4zMTIuNTUyTTEzMS45NzcgMjAuMDEyaDUuNDc1bC0yLjY5Mi03LjQyOWgtLjA5MmwtMi42OTEgNy40M3ptLTQuNjcgNi40NGw2LjIxLTE2LjQ2N2gyLjM5NGw2LjIxIDE2LjQ2N2gtMi4zNDZsLTEuNTg4LTQuNDZoLTYuOTIzbC0xLjYxIDQuNDZoLTIuMzQ2eiIvPjwvZz48ZyBmaWxsPSIjNUY2MzY4Ij48cGF0aCBkPSJNMTEyLjE5IDIwLjYzN2w1LjM2NC0yLjIyOGMtLjI5Ni0uNzUtMS4xODEtMS4yNzItMi4yMjctMS4yNzItMS4zNDEgMC0zLjIwNCAxLjE4Mi0zLjEzNyAzLjVtNi4yOTYgMi4xNTlsMi4wNDUgMS4zNjNjLS42NTguOTc4LTIuMjUgMi42Ni01IDIuNjYtMy40MDggMC01Ljg3LTIuNjM3LTUuODctNiAwLTMuNTcgMi40ODQtNi4wMDEgNS41NzUtNi4wMDEgMy4xMTQgMCA0LjYzNyAyLjQ3OCA1LjEzNiAzLjgxOWwuMjczLjY4Mi04LjAyMyAzLjMxOGMuNjE0IDEuMjA1IDEuNTY4IDEuODE4IDIuOTA5IDEuODE4IDEuMzQgMCAyLjI3My0uNjYgMi45NTUtMS42Nk0xMDUuNDg0IDI2LjQ1NWgyLjYzNlY4LjgxOGgtMi42MzZ6TTEwMS4xODMgMjAuODQxYzAtMi4xMTMtMS40MS0zLjY1OS0zLjIwNS0zLjY1OS0xLjgxNyAwLTMuMzQxIDEuNTQ2LTMuMzQxIDMuNjU5IDAgMi4wOTEgMS41MjQgMy42MTQgMy4zNCAzLjYxNCAxLjc5NiAwIDMuMjA2LTEuNTIzIDMuMjA2LTMuNjE0em0yLjMxNy01LjY1OXYxMC43NzNjMCA0LjQzMi0yLjYxMyA2LjI1MS01LjcwNCA2LjI1MS0yLjkxIDAtNC42Ni0xLjk1NS01LjMxOC0zLjU0NmwyLjI5NS0uOTU1Yy40MS45NzcgMS40MSAyLjEzNiAzLjAyMyAyLjEzNiAxLjk3NyAwIDMuMjA1LTEuMjI3IDMuMjA1LTMuNTYydi0uODY0aC0uMDkxYy0uNTkxLjcyNy0xLjcyOCAxLjM2NC0zLjE2IDEuMzY0LTMgMC01Ljc1LTIuNjE0LTUuNzUtNS45NzggMC0zLjM4NiAyLjc1LTYuMDIzIDUuNzUtNi4wMjMgMS40MzIgMCAyLjU2OS42MzYgMy4xNiAxLjM0MWguMDl2LS45NzdoMi41ek03NC43MyAyMC44MTljMC0yLjE2LTEuNTQtMy42MzctMy4zMjUtMy42MzctMS43ODUgMC0zLjMyNSAxLjQ3OC0zLjMyNSAzLjYzNyAwIDIuMTM2IDEuNTQgMy42MzYgMy4zMjUgMy42MzYgMS43ODUgMCAzLjMyNS0xLjUgMy4zMjUtMy42MzZtMi41ODggMGMwIDMuNDU0LTIuNjU1IDYtNS45MTMgNi0zLjI1OCAwLTUuOTEzLTIuNTQ2LTUuOTEzLTYgMC0zLjQ3OCAyLjY1NS02IDUuOTEzLTYgMy4yNTggMCA1LjkxMyAyLjUyMSA1LjkxMyA2TTg3Ljk4NyAyMC44MTljMC0yLjE2LTEuNTQtMy42MzctMy4zMjUtMy42MzctMS43ODUgMC0zLjMyNSAxLjQ3OC0zLjMyNSAzLjYzNyAwIDIuMTM2IDEuNTQgMy42MzYgMy4zMjUgMy42MzYgMS43ODUgMCAzLjMyNS0xLjUgMy4zMjUtMy42MzZtMi41ODkgMGMwIDMuNDU0LTIuNjU2IDYtNS45MTQgNi0zLjI1OCAwLTUuOTEzLTIuNTQ2LTUuOTEzLTYgMC0zLjQ3OCAyLjY1NS02IDUuOTEzLTYgMy4yNTggMCA1LjkxNCAyLjUyMSA1LjkxNCA2TTU1LjM2IDI2LjgxOWMtNS4xMzUgMC05LjQ1NC00LjE4Mi05LjQ1NC05LjMxOCAwLTUuMTM3IDQuMzE5LTkuMzIgOS40NTUtOS4zMiAyLjg0MiAwIDQuODY0IDEuMTE1IDYuMzg3IDIuNTdsLTEuNzk2IDEuNzk1Yy0xLjA5MS0xLjAyMy0yLjU2OC0xLjgxOC00LjU5MS0xLjgxOC0zLjc1IDAtNi42ODMgMy4wMjMtNi42ODMgNi43NzMgMCAzLjc1IDIuOTMzIDYuNzcyIDYuNjgzIDYuNzcyIDIuNDMyIDAgMy44MTgtLjk3NyA0LjcwNS0xLjg2NC43MjctLjcyNiAxLjIwNS0xLjc3MiAxLjM4Ni0zLjIwNEg1NS4zNlYxNi42Nmg4LjU2OGMuMDkyLjQ1NC4xMzcgMSAuMTM3IDEuNTkgMCAxLjkxLS41MjMgNC4yNzQtMi4yMDQgNS45NTYtMS42MzcgMS43MDQtMy43MjggMi42MTMtNi41MDEgMi42MTMiLz48L2c+PHBhdGggZD0iTTI5LjE2NyAzLjkxM0g1Ljc5NWEyLjE5OCAyLjE5OCAwIDAgMC0yLjE5IDIuMTl2LjE4NGMwLTEuMjA1Ljk4NS0yLjE5MSAyLjE5LTIuMTkxaDIzLjM3MmMxLjIwNSAwIDIuMTkxLjk4NiAyLjE5MSAyLjE5di0uMTgyYTIuMTk4IDIuMTk4IDAgMCAwLTIuMTktMi4xOTEiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMjEuNjc3IDkuMDYzYzEuNDA4LTIuNDEuNTcyLTUuNDktMS44NjctNi44ODItMi40NC0xLjM5LTUuNTU5LS41NjYtNi45NjcgMS44NDRhNS40OSA1LDQ5IDAgMCAwLS4xNzUuMzNsLTQuNzYgOC4xNDNhNi4wMDQgNi4wMDQgMCAwIDAtLjI5Mi41bC00Ljk0MyA4LjUzIDguODMzIDQuOTUxIDQuOTE4LTguNDU4YTQuODY3IDQuODY3IDAgMCAwIC4yOTItLjVsNC43Ni04LjE0NGMuMDY5LS4xMDIuMTM4LS4yMDYuMjAxLS4zMTQiIGZpbGw9IiNGQkJDMDQiLz48cGF0aCBkPSJNMTEuNTQ3IDI2LjQ1M2MtMS40IDIuNDQ5LTQuNTU4IDMuMzUtNi45ODMgMS45MzctMi40MjYtMS40MTQtMy4yODctNC40OC0xLjg4Ni02LjkyOCAxLjcwMS0yLjQ0OCA0LjUzMS0zLjM1MyA2Ljk1Ny0xLjk0IDIuNDI2IDEuNDE0IDMuMzEyIDQuNDgzIDEuOTEyIDYuOTMiIGZpbGw9IiMzNEE4NTMiLz48cGF0aCBkPSJNMjAuNjA4IDEwLjY3NWE1LjA1IDUuMDUgMCAwIDAtNi44ODkgMS44NGwtNS4wNDMgOC43MTRhNS4wMjQgNS4wMjQgMCAwIDAgMS44NDYgNi44NzIgNS4wNSA1LjA1IDAgMCAwIDYuODktMS44NDFsNS4wNDItOC43MTNhNS4wMjUgNS4wMjUgMCAwIDAtMS44NDYtNi44NzIiIGZpbGw9IiM0Mjg1RjQiLz48L2c+PC9zdmc+Cg==";

const AdSenseFullLogo = () => (
  <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
    <img
      src={ADSENSE_LOGO_SVG_BASE64}
      alt="Google AdSense"
      style={{ height: "26px", width: "auto", display: "block" }}
    />
  </div>
);

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Menu Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AdsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 8h4v4H7z" />
    <path d="M15 8h2M15 12h2M7 16h10" />
  </svg>
);

const SitesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const PrivacyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    <path d="M12 14c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" />
  </svg>
);

const BrandSafetyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 17v-4M12 17V7M17 17v-7" />
  </svg>
);

const OptimizationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const PolicyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const PaymentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6" cy="15" r="1" fill="currentColor" />
  </svg>
);

const DotIcon = ({ active }: { active?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={active ? "#1A73E8" : "#5F6368"}>
    <circle cx="12" cy="12" r="5" />
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const handleNav = (pageId: string, title: string, path: string) => {
    navigateTo({
      title: `${title} – Google AdSense`,
      url: `adsense.google.com/adsense/u/0/pub-222938054781862/${path}`,
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
            <div className="sidebar-header-divider" />
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
            className={`sidebar-item expandable ${activePageId === "brand-safety" ? "active" : ""}`}
            onClick={() => setBrandSafetyExpanded(!brandSafetyExpanded)}
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
            onClick={() => handleNav("reports", "Reports", "reports/overview")}
          >
            <div className="sidebar-item-content">
              <span className="sidebar-icon"><ReportsIcon /></span>
              {!isCollapsed && <span className="sidebar-label">Reports</span>}
            </div>
          </div>

          <div
            className={`sidebar-item expandable ${activePageId === "optimization" ? "active" : ""}`}
            onClick={() => setOptimizationExpanded(!optimizationExpanded)}
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
            className="sidebar-item expandable"
            onClick={() => setPaymentsExpanded(!paymentsExpanded)}
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
                className={`sidebar-item subitem ${activePageId === "payments-info" ? "active" : ""}`}
                onClick={() => handleNav("payments-info", "Payments info", "payments/info")}
              >
                <div className="sidebar-item-content">
                  <span className="sidebar-subicon"><DotIcon active={activePageId === "payments-info"} /></span>
                  <span className="sidebar-label">Payments info</span>
                </div>
              </div>

              <div
                className={`sidebar-item subitem ${activePageId === "verification-check" ? "active" : ""}`}
                onClick={() => handleNav("verification-check", "Verification check", "payments/verification")}
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
            className={`sidebar-item expandable ${activePageId === "settings" || activePageId === "account" ? "active" : ""}`}
            onClick={() => setAccountExpanded(!accountExpanded)}
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
