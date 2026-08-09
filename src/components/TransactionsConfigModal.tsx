import React from "react";
import {
  EarningsConfigData,
  TransactionItem,
  DEFAULT_EARNINGS_CONFIG,
} from "./EarningsConfigModal";

interface TransactionsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EarningsConfigData;
  onSaveConfig: (newConfig: EarningsConfigData) => void;
}

export const TransactionsConfigModal: React.FC<TransactionsConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = React.useState<EarningsConfigData>(() => ({
    ...DEFAULT_EARNINGS_CONFIG,
    ...config,
  }));

  React.useEffect(() => {
    setFormData({
      ...DEFAULT_EARNINGS_CONFIG,
      ...config,
    });
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (monthKey: "month1Items" | "month2Items" | "month3Items") => {
    const list = formData[monthKey] || [];
    const newItem: TransactionItem = {
      id: Date.now().toString(),
      date: monthKey === "month1Items" ? "Aug 1\u2009\u2013\u20099, 2026" : monthKey === "month2Items" ? "Jul 1\u2009\u2013\u200931, 2026" : "Jun 1\u2009\u2013\u200930, 2026",
      description: "Earnings - AdSense for Content",
      amount: 0.00,
    };
    setFormData({
      ...formData,
      [monthKey]: [...list, newItem],
    });
  };

  const handleUpdateItem = (
    monthKey: "month1Items" | "month2Items" | "month3Items",
    index: number,
    field: keyof TransactionItem,
    val: string | number
  ) => {
    const list = [...(formData[monthKey] || [])];
    list[index] = {
      ...list[index],
      [field]: val,
    };
    setFormData({
      ...formData,
      [monthKey]: list,
    });
  };

  const handleDeleteItem = (
    monthKey: "month1Items" | "month2Items" | "month3Items",
    index: number
  ) => {
    const list = [...(formData[monthKey] || [])];
    list.splice(index, 1);
    setFormData({
      ...formData,
      [monthKey]: list,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const m3Items = formData.month3Items || [];
    const m2Items = formData.month2Items || [];
    const m1Items = formData.month1Items || [];

    const m3Sum = m3Items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const m3Start = Number(formData.initialStartingBalance) || 0;
    const m3End = Number((m3Start + m3Sum).toFixed(2));

    const m2Sum = m2Items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const m2Start = m3End;
    const m2End = Number((m2Start + m2Sum).toFixed(2));

    const m1Sum = m1Items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const m1Start = m2End;
    const m1End = Number((m1Start + m1Sum).toFixed(2));

    const updatedConfig: EarningsConfigData = {
      ...formData,
      currentEarnings: m1Items.length > 0 ? m1End : m2End,
      augAmount: m1Sum !== 0 ? Math.abs(m1Sum) : 0.42,
      julAmount: m2Items.find((i) => i.amount > 0)?.amount ?? 0.42,
      junAmount: m3Items.find((i) => i.amount > 0)?.amount ?? 392.47,
    };

    onSaveConfig(updatedConfig);
    onClose();
  };

  const renderMonthEditor = (
    title: string,
    monthKey: "month1Items" | "month2Items" | "month3Items"
  ) => {
    const items = formData[monthKey] || [];

    return (
      <div className="settings-group" style={{ backgroundColor: "#fafafa", padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#202124", margin: 0 }}>
            {title} ({items.length} 条明细)
          </h4>
          <button
            type="button"
            onClick={() => handleAddItem(monthKey)}
            style={{
              backgroundColor: "#e8f0fe",
              color: "#1a73e8",
              border: "1px solid #1a73e8",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            + Add Record (添加明细)
          </button>
        </div>

        {items.length === 0 ? (
          <p style={{ fontSize: "12px", color: "#80868b", fontStyle: "italic", margin: "6px 0" }}>
            （暂无交易明细，页面将自动显示 "You don’t have any transactions for this billing period"）
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2.8fr 1.2fr 36px",
                  gap: "10px",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #dadce0",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", color: "#5f6368", display: "block", marginBottom: "2px" }}>Date (日期):</span>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => handleUpdateItem(monthKey, idx, "date", e.target.value)}
                    style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#5f6368", display: "block", marginBottom: "2px" }}>Description (描述):</span>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(monthKey, idx, "description", e.target.value)}
                    style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#5f6368", display: "block", marginBottom: "2px" }}>Amount (金额):</span>
                  <input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => handleUpdateItem(monthKey, idx, "amount", Number(e.target.value))}
                    style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(monthKey, idx)}
                  title="Delete record"
                  style={{
                    backgroundColor: "transparent",
                    color: "#d93025",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    padding: "4px",
                    marginTop: "14px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card settings-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "880px", maxWidth: "94vw", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}
      >
        {/* Header */}
        <div className="settings-modal-header" style={{ paddingBottom: "12px" }}>
          <div className="settings-user-info">
            <h3 className="settings-user-name" style={{ fontSize: "16px", color: "#1a73e8", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "20px" }}>
                receipt_long
              </i>
              Configure Transactions & History (配置近三个月交易记录明细)
            </h3>
            <span className="settings-user-pub" style={{ color: "#5f6368", fontSize: "12px" }}>
              Add, edit, or delete items for Date, Description & Amount • Auto calculates balances
            </span>
          </div>
          <button className="settings-modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="settings-modal-divider" />

        <form onSubmit={handleSave} className="settings-modal-body" style={{ gap: "16px", display: "flex", flexDirection: "column" }}>
          {/* Global Settings: Base Initial Starting Balance & Currency Code */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", backgroundColor: "#e8f0fe", padding: "12px", borderRadius: "8px" }}>
            <div>
              <label className="settings-label" style={{ fontWeight: 700, color: "#1a73e8" }}>
                0. Base Initial Starting Balance (最底月份基准期初余额)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.initialStartingBalance ?? 0.37}
                onChange={(e) => setFormData({ ...formData, initialStartingBalance: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label className="settings-label" style={{ fontWeight: 700, color: "#1a73e8" }}>
                Currency Code (表头货币代码，如 USD, EUR)
              </label>
              <input
                type="text"
                value={formData.currencyCode || "USD"}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                className="settings-num-input"
                style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", fontWeight: 700 }}
                required
              />
            </div>
          </div>

          {/* Month 1, Month 2, Month 3 Item Editors */}
          {renderMonthEditor("1. Month 1 (Current Month - 最新当月明细)", "month1Items")}
          {renderMonthEditor("2. Month 2 (1 Month Ago - 上个月交易明细)", "month2Items")}
          {renderMonthEditor("3. Month 3 (2 Months Ago - 上上个月交易明细)", "month3Items")}

          {/* Footer Actions */}
          <div className="settings-modal-footer" style={{ marginTop: "12px", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn-text-cancel" onClick={onClose}>
                Cancel (取消)
              </button>
              <button type="submit" className="btn-solid-save">
                Save & Recalculate (保存并联动重新计算)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
