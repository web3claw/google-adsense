import React from "react";

export interface TransactionItem {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface MonthBlockData {
  id: string;
  items: TransactionItem[];
}

export interface EarningsConfigData {
  countryName: string;
  currentEarnings: number;
  threshold: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;

  // Additional Card Parameters
  payeeName: string;
  pubId: string;
  bankMasked: string;
  augAmount: number;
  julAmount: number;
  junAmount: number;

  // Transactions Settings
  currencyCode?: string; // e.g. "USD", "EUR", "GBP"
  initialStartingBalance?: number; // e.g. 0.37
  customBaseDate?: string; // YYYY-MM-DD format (e.g. 2026-08-10)

  // Dynamic Month Blocks List (supports N months!)
  monthsData?: MonthBlockData[];

  // Legacy fallback fields for backward compatibility
  month1Items?: TransactionItem[];
  month2Items?: TransactionItem[];
  month3Items?: TransactionItem[];
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
  lastPaymentDate: "Jul 21",
  lastPaymentAmount: 392.45,

  payeeName: "Emmanuel Dellbrügger",
  pubId: "pub-8666469182451238",
  bankMasked: "DE••\u2009••••\u2009••••\u2009••••\u2009••07\u200949",
  augAmount: 0.42,
  julAmount: 0.42,
  junAmount: 392.47,

  currencyCode: "USD",
  initialStartingBalance: 0.37,
  customBaseDate: "",

  monthsData: [
    {
      id: "month-block-1",
      items: [],
    },
    {
      id: "month-block-2",
      items: [
        {
          id: "m2-1",
          date: "Jul 1 – 31, 2026",
          description: "Earnings - AdSense for Content",
          amount: 0.42,
        },
        {
          id: "m2-2",
          date: "Jul 21, 2026",
          description: "Automatic payment: Bank account ····0749. GG104GK2OJ",
          amount: -392.45,
        },
        {
          id: "m2-3",
          date: "Jul 3 – 4, 2026",
          description: "Invalid Traffic - AdSense for Content",
          amount: -0.02,
        },
      ],
    },
    {
      id: "month-block-3",
      items: [
        {
          id: "m3-1",
          date: "Jun 1 – 30, 2026",
          description: "Invalid Traffic - AdSense for Content",
          amount: -0.03,
        },
        {
          id: "m3-2",
          date: "Jun 1 – 30, 2026",
          description: "Earnings - AdSense for Content",
          amount: 392.13,
        },
      ],
    },
  ],

  month1Items: [],
  month2Items: [
    {
      id: "m2-1",
      date: "Jul 1 – 31, 2026",
      description: "Earnings - AdSense for Content",
      amount: 0.42,
    },
    {
      id: "m2-2",
      date: "Jul 21, 2026",
      description: "Automatic payment: Bank account ····0749. GG104GK2OJ",
      amount: -392.45,
    },
    {
      id: "m2-3",
      date: "Jul 3 – 4, 2026",
      description: "Invalid Traffic - AdSense for Content",
      amount: -0.02,
    },
  ],
  month3Items: [
    {
      id: "m3-1",
      date: "Jun 1 – 30, 2026",
      description: "Invalid Traffic - AdSense for Content",
      amount: -0.03,
    },
    {
      id: "m3-2",
      date: "Jun 1 – 30, 2026",
      description: "Earnings - AdSense for Content",
      amount: 392.13,
    },
  ],
};

export const EarningsConfigModal: React.FC<EarningsConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = React.useState<EarningsConfigData>(config);

  React.useEffect(() => {
    setFormData({
      ...DEFAULT_EARNINGS_CONFIG,
      ...config,
    });
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.currencyCode) {
      const code = formData.currencyCode.toUpperCase().trim();
      let mappedSym = "$";
      if (code === "EUR" || code === "€") mappedSym = "€";
      else if (code === "GBP" || code === "£") mappedSym = "£";
      else if (code === "CNY" || code === "¥") mappedSym = "¥";
      else if (code === "HKD" || code === "HK$") mappedSym = "HK$";
      else if (code === "USD" || code === "$") mappedSym = "$";
      else mappedSym = formData.currencyCode;
      localStorage.setItem("adsense_currency_symbol", mappedSym);
    }

    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px", maxHeight: "75vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="settings-modal-header" style={{ paddingBottom: "12px" }}>
          <div className="settings-user-info">
            <h3 className="settings-user-name" style={{ fontSize: "16px", color: "#1a73e8", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px" }}>
                account_balance_wallet
              </i>
              Configure Payments Parameters (配置 Payments 页面所有参数)
            </h3>
            <span className="settings-user-pub" style={{ color: "#5f6368", fontSize: "12px" }}>
              Card Settings • Changes apply immediately
            </span>
          </div>
          <button className="settings-modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="settings-modal-divider" />

        <form onSubmit={handleSave} className="settings-modal-body" style={{ gap: "14px", display: "flex", flexDirection: "column" }}>
          {/* Section 1: Earnings & Account */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                1. Country Name (国家/地区)
              </label>
              <input
                type="text"
                value={formData.countryName}
                onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>

            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                2. Payee Name (收款人姓名)
              </label>
              <input
                type="text"
                value={formData.payeeName}
                onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                3. Publisher ID (AdSense pub-ID)
              </label>
              <input
                type="text"
                value={formData.pubId}
                onChange={(e) => setFormData({ ...formData, pubId: e.target.value })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>

            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                4. Bank Account (银行卡尾号)
              </label>
              <input
                type="text"
                value={formData.bankMasked}
                onChange={(e) => setFormData({ ...formData, bankMasked: e.target.value })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                5. Current Earnings (当前收益)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentEarnings}
                onChange={(e) => setFormData({ ...formData, currentEarnings: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>

            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                6. Payment Threshold (起付阈值)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>
          </div>

          {/* Section 2: Last Payment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                7. Last Payment Date (上次付款日期)
              </label>
              <input
                type="text"
                value={formData.lastPaymentDate}
                onChange={(e) => setFormData({ ...formData, lastPaymentDate: e.target.value })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>

            <div className="settings-group">
              <label className="settings-label" style={{ fontWeight: 600 }}>
                8. Last Payment Amount (上次付款金额)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.lastPaymentAmount}
                onChange={(e) => setFormData({ ...formData, lastPaymentAmount: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 10px", fontSize: "13px" }}
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
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
