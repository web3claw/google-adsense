import React from "react";

export interface EarningsConfigData {
  countryName: string;
  currentEarnings: number;
  threshold: number;
  isCustomProgress: boolean;
  customProgressPercent: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

interface EarningsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EarningsConfigData;
  onSaveConfig: (newConfig: EarningsConfigData) => void;
}

export const DEFAULT_EARNINGS_CONFIG: EarningsConfigData = {
  countryName: "United Kingdom",
  currentEarnings: 0.42,
  threshold: 70.0,
  isCustomProgress: false,
  customProgressPercent: 0,
  lastPaymentDate: "Jul 21",
  lastPaymentAmount: 392.45,
};

export const EarningsConfigModal: React.FC<EarningsConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = React.useState<EarningsConfigData>(config);

  React.useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const calculatedPercent =
    formData.threshold > 0
      ? Math.min(100, Math.floor((formData.currentEarnings / formData.threshold) * 100))
      : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div className="settings-modal-header" style={{ paddingBottom: "12px" }}>
          <div className="settings-user-info">
            <h3 className="settings-user-name" style={{ fontSize: "16px", color: "#1a73e8", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px" }}>
                account_balance_wallet
              </i>
              Configure "Your Earnings" Parameters (配置收益卡片参数)
            </h3>
            <span className="settings-user-pub" style={{ color: "#5f6368", fontSize: "12px" }}>
              Double-click card settings • Changes apply immediately
            </span>
          </div>
          <button className="settings-modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="settings-modal-divider" />

        <form onSubmit={handleSave} className="settings-modal-body" style={{ gap: "16px", display: "flex", flexDirection: "column" }}>
          {/* Item 0: Country Name */}
          <div className="settings-group">
            <label className="settings-label" style={{ fontWeight: 600 }}>
              1. Account Country Name (付款账号国家/地区名称)
            </label>
            <p className="settings-hint">Displayed in "AdSense (United Kingdom)" title (e.g. United Kingdom, United States)</p>
            <input
              type="text"
              value={formData.countryName}
              onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
              placeholder="e.g. United Kingdom, United States"
              className="settings-num-input"
              style={{ width: "100%", height: "36px", padding: "0 12px", fontSize: "14px", fontWeight: 600 }}
              required
            />
          </div>

          {/* Item 1: Current Earnings Amount */}
          <div className="settings-group">
            <label className="settings-label" style={{ fontWeight: 600 }}>
              2. Current Earnings Amount (当前收益金额)
            </label>
            <p className="settings-hint">Displayed at top right of card (e.g. 0.42, 135.12)</p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.currentEarnings}
              onChange={(e) => setFormData({ ...formData, currentEarnings: Number(e.target.value) })}
              className="settings-num-input"
              style={{ width: "100%", height: "36px", padding: "0 12px", fontSize: "14px", fontWeight: 600 }}
              required
            />
          </div>

          {/* Item 2: Payment Threshold */}
          <div className="settings-group">
            <label className="settings-label" style={{ fontWeight: 600 }}>
              3. Payment Threshold (付款起付额/阈值)
            </label>
            <p className="settings-hint">Standard threshold is 70.00 or 60.00 (syncs to subtitle & footer)</p>
            <input
              type="number"
              step="0.01"
              min="1"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
              className="settings-num-input"
              style={{ width: "100%", height: "36px", padding: "0 12px", fontSize: "14px", fontWeight: 600 }}
              required
            />
          </div>

          {/* Item 3: Progress Percentage */}
          <div className="settings-group">
            <label className="settings-label" style={{ fontWeight: 600 }}>
              4. Progress Percentage (进度百分比)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="progressMode"
                  checked={!formData.isCustomProgress}
                  onChange={() => setFormData({ ...formData, isCustomProgress: false })}
                />
                <span>Auto calculate (自动联动计算: {calculatedPercent}%)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="progressMode"
                  checked={formData.isCustomProgress}
                  onChange={() => setFormData({ ...formData, isCustomProgress: true })}
                />
                <span>Custom percentage (手动指定百分比)</span>
              </label>

              {formData.isCustomProgress && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "24px" }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.customProgressPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customProgressPercent: Math.min(100, Math.max(0, Number(e.target.value))),
                      })
                    }
                    className="settings-num-input"
                    style={{ width: "90px", height: "32px", padding: "0 8px", fontSize: "14px" }}
                  />
                  <span style={{ fontSize: "13px", color: "#5f6368" }}>%</span>
                </div>
              )}
            </div>
          </div>

          {/* Item 4 & 5: Last Payment Date & Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                5. Last Payment Date (上次付款日期)
              </label>
              <input
                type="text"
                value={formData.lastPaymentDate}
                onChange={(e) => setFormData({ ...formData, lastPaymentDate: e.target.value })}
                placeholder="e.g. Jul 21"
                className="settings-num-input"
                style={{ width: "100%", height: "36px", padding: "0 12px", fontSize: "14px" }}
                required
              />
            </div>

            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                6. Last Payment Amount (上次付款金额)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.lastPaymentAmount}
                onChange={(e) => setFormData({ ...formData, lastPaymentAmount: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "36px", padding: "0 12px", fontSize: "14px" }}
                required
              />
            </div>
          </div>

          {/* Footer Actions (Reset Defaults Removed) */}
          <div className="settings-modal-footer" style={{ marginTop: "12px", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn-text-cancel" onClick={onClose}>
                Cancel (取消)
              </button>
              <button type="submit" className="btn-solid-save">
                Save Changes (保存修改)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
