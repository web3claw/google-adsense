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
  } = useBrowser();

  if (!isSettingsModalOpen) return null;

  const handleResetDefaults = () => {
    setNetworkDelay(1000);
    setCurrencySymbol("$");
  };

  const currencyOptions = [
    { symbol: "$", code: "USD", name: "US Dollar ($)" },
    { symbol: "£", code: "GBP", name: "British Pound (£)" },
    { symbol: "€", code: "EUR", name: "Euro (€)" },
    { symbol: "¥", code: "CNY", name: "Chinese Yuan / Yen (¥)" },
    { symbol: "HK$", code: "HKD", name: "Hong Kong Dollar (HK$)" },
  ];

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
      <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with Google Profile Info */}
        <div className="settings-modal-header">
          <div className="settings-user-avatar">A</div>
          <div className="settings-user-info">
            <h3 className="settings-user-name">ABAYOMI ADEMOLA ALLI-BALOGUN</h3>
            <span className="settings-user-pub">pub-2229538054781862</span>
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

          {/* Section 1: Currency Symbol Settings */}
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

          {/* Section 2: Unified Network Loading Simulation Delay */}
          <div className="settings-group">
            <div className="settings-label-row">
              <label className="settings-label">
                Network Fetch & Loading Latency (网络读取与刷新等待时间)
              </label>
              <span className="settings-value-badge">{networkDelay} ms</span>
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
