import React from "react";
import { useBrowser } from "../context/BrowserContext";

export const GlobalSettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    networkDelay,
    setNetworkDelay,
    currencySymbol,
    setCurrencySymbol,
    uiScalePercent,
    setUiScalePercent,
    userProfileName,
    setUserProfileName,
    userProfileEmail,
    setUserProfileEmail,
  } = useBrowser();

  if (!isSettingsModalOpen) return null;

  const handleResetDefaults = () => {
    setNetworkDelay(1000);
    setCurrencySymbol("$");
    setUiScalePercent(110);
    setUserProfileName("Sashmita Caglar");
    setUserProfileEmail("sashmitacaglar@gmail.com");
  };

  const currencyOptions = [
    { symbol: "$", code: "USD", name: "US Dollar ($)" },
    { symbol: "£", code: "GBP", name: "British Pound (£)" },
    { symbol: "€", code: "EUR", name: "Euro (€)" },
    { symbol: "¥", code: "CNY", name: "Chinese Yuan / Yen (¥)" },
    { symbol: "HK$", code: "HKD", name: "Hong Kong Dollar (HK$)" },
  ];

  const scalePresets = [
    { label: "90%", value: 90, desc: "精细" },
    { label: "100%", value: 100, desc: "标准" },
    { label: "110%", value: 110, desc: "默认" },
    { label: "120%", value: 120, desc: "大号" },
  ];

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
      <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
        {/* Header with Google Profile Info */}
        <div className="settings-modal-header">
          <div className="settings-user-avatar">
            {userProfileEmail && userProfileEmail.trim().length > 0
              ? userProfileEmail.trim().charAt(0).toUpperCase()
              : "A"}
          </div>
          <div className="settings-user-info">
            <h3 className="settings-user-name">{userProfileName}</h3>
            <span className="settings-user-pub">{userProfileEmail}</span>
          </div>
          <button
            className="settings-modal-close-btn"
            onClick={() => setIsSettingsModalOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="settings-modal-divider" />

        <div className="settings-modal-body">
          <h4 className="settings-section-title">
            <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#1a73e8", marginRight: "6px", verticalAlign: "middle" }}>
              settings
            </i>
            Global Preferences & Network Simulation (全局设置)
          </h4>

          {/* Section 0.5: Google User Profile Settings (姓名与邮箱) */}
          <div className="settings-group" style={{ backgroundColor: "#f8f9fa", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <label className="settings-label" style={{ color: "#202124", fontSize: "14px" }}>
              Google Profile Information (个人账号姓名与邮箱)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#3c4043", width: "80px", flexShrink: 0 }}>
                  Account Name:
                </label>
                <input
                  type="text"
                  value={userProfileName}
                  onChange={(e) => setUserProfileName(e.target.value)}
                  placeholder="e.g. Sashmita Caglar"
                  className="settings-num-input"
                  style={{ flex: 1, height: "34px", padding: "0 10px", fontSize: "13.5px", backgroundColor: "#ffffff" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#3c4043", width: "80px", flexShrink: 0 }}>
                  Account Email:
                </label>
                <input
                  type="email"
                  value={userProfileEmail}
                  onChange={(e) => setUserProfileEmail(e.target.value)}
                  placeholder="e.g. sashmitacaglar@gmail.com"
                  className="settings-num-input"
                  style={{ flex: 1, height: "34px", padding: "0 10px", fontSize: "13.5px", backgroundColor: "#ffffff" }}
                />
              </div>
            </div>
          </div>

          {/* Section 1: Display Resolution & UI Scale */}
          <div className="settings-group">
            <div className="settings-label-row">
              <label className="settings-label">
                Display Resolution & UI Scaling (界面分辨率与缩放比例)
              </label>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a73e8" }}>
                {uiScalePercent}%
              </span>
            </div>
            <p className="settings-hint">
              Scales entire window including topbar, sidebar, fonts, icons, and page cards proportionately like OS display resolution.
            </p>

            {/* Scale Presets Grid */}
            <div className="currency-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "8px" }}>
              {scalePresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`currency-option-btn ${uiScalePercent === preset.value ? "selected" : ""}`}
                  onClick={() => setUiScalePercent(preset.value)}
                  style={{ flexDirection: "column", padding: "6px 4px", textAlign: "center", alignItems: "center" }}
                >
                  <span className="currency-symbol-tag" style={{ fontSize: "13px", width: "auto" }}>{preset.label}</span>
                  <span className="currency-name" style={{ fontSize: "10px", color: "#5f6368" }}>{preset.desc}</span>
                </button>
              ))}
            </div>

            {/* Slider & Number Input */}
            <div className="settings-slider-row" style={{ marginTop: "10px" }}>
              <input
                type="range"
                min="70"
                max="160"
                step="5"
                value={uiScalePercent}
                onChange={(e) => setUiScalePercent(Number(e.target.value))}
                className="settings-range-input"
              />
              <input
                type="number"
                min="70"
                max="160"
                value={uiScalePercent}
                onChange={(e) => setUiScalePercent(Math.min(160, Math.max(70, Number(e.target.value))))}
                className="settings-num-input"
                style={{ width: "75px" }}
              />
              <span style={{ fontSize: "12px", color: "#5f6368" }}>%</span>
            </div>
          </div>

          {/* Section 2: Currency Symbol Settings */}
          <div className="settings-group">
            <label className="settings-label">
              Global Currency Symbol (全局金额符号)
            </label>
            <p className="settings-hint">
              Controls currency format ($ / £ / € / ¥ / HK$) across all Sites and Payments tables.
            </p>
            <div className="currency-grid">
              {currencyOptions.map((opt) => (
                <button
                  key={opt.symbol}
                  type="button"
                  className={`currency-option-btn ${currencySymbol === opt.symbol ? "selected" : ""}`}
                  onClick={() => setCurrencySymbol(opt.symbol)}
                >
                  <span className="currency-symbol-tag">{opt.symbol}</span>
                  <span className="currency-name">{opt.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Currency Symbol Input */}
            <div className="custom-currency-row" style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", borderTop: "1px dashed #dadce0", paddingTop: "10px" }}>
              <label className="settings-hint" style={{ fontWeight: 600, color: "#202124", whiteSpace: "nowrap" }}>
                Custom Symbol (自定义符号):
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="e.g. HK$, NT$, Rp, ฿"
                className="settings-num-input"
                style={{ width: "140px", height: "34px", padding: "0 10px", fontSize: "14px", fontWeight: 700, color: "#1a73e8", backgroundColor: "#ffffff" }}
              />
            </div>
          </div>

          {/* Section 3: Unified Network Loading Simulation Delay */}
          <div className="settings-group">
            <div className="settings-label-row">
              <label className="settings-label">
                Network Fetch & Loading Latency (网络读取与刷新等待时间)
              </label>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#1a73e8" }}>
                {networkDelay} ms
              </span>
            </div>
            <p className="settings-hint">
              Unified delay for page refresh and page navigation network fetch simulation (0 ms - 50000 ms). Default is 1000 ms.
            </p>
            <div className="settings-slider-row">
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={networkDelay}
                onChange={(e) => setNetworkDelay(Number(e.target.value))}
                className="settings-range-input"
              />
              <input
                type="number"
                min="0"
                max="50000"
                value={networkDelay}
                onChange={(e) => setNetworkDelay(Math.min(50000, Math.max(0, Number(e.target.value))))}
                className="settings-num-input"
                style={{ width: "90px" }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="settings-modal-footer">
          <button
            type="button"
            className="btn-text-cancel"
            onClick={handleResetDefaults}
          >
            Reset Defaults (恢复默认)
          </button>
          <button
            type="button"
            className="btn-solid-save"
            onClick={() => setIsSettingsModalOpen(false)}
          >
            Save & Close (保存)
          </button>
        </div>
      </div>
    </div>
  );
};
