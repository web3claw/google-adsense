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

export function computeThreeMonthsDateInfo(baseDateStr?: string) {
  let base: Date;
  if (baseDateStr && !isNaN(Date.parse(baseDateStr))) {
    base = new Date(`${baseDateStr}T12:00:00`);
  } else {
    base = new Date();
  }

  const year = base.getFullYear();
  const month = base.getMonth(); // 0-indexed
  const day = base.getDate();

  // Month 1: Current month (from 1st to base day)
  const m1Name = base.toLocaleDateString("en-US", { month: "short" });
  const row1Text = `${m1Name} 1\u2009\u2013\u2009${day}, ${year}`;

  // Month 2: 1 Month ago
  const d2 = new Date(year, month - 1, 1);
  const m2Name = d2.toLocaleDateString("en-US", { month: "short" });
  const y2 = d2.getFullYear();
  const lastDay2 = new Date(year, month, 0).getDate();
  const row2Text = `${m2Name} 1\u2009\u2013\u2009${lastDay2}, ${y2}`;
  const row2PayDate = `${m2Name} 21, ${y2}`;

  // Month 3: 2 Months ago
  const d3 = new Date(year, month - 2, 1);
  const m3Name = d3.toLocaleDateString("en-US", { month: "short" });
  const y3 = d3.getFullYear();
  const lastDay3 = new Date(year, month - 1, 0).getDate();
  const row3Text = `${m3Name} 1\u2009\u2013\u2009${lastDay3}, ${y3}`;

  return {
    row1Text,
    row2Text,
    row3Text,
    row2PayDate,
    m1Name,
    m2Name,
    m3Name,
  };
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

  const dateInfo = computeThreeMonthsDateInfo(formData.customBaseDate);

  // When date picker changes, update base date
  const handleBaseDateChange = (newDateStr: string) => {
    const computed = computeThreeMonthsDateInfo(newDateStr);

    // Automatically update default dates for items if requested
    const m2Items = (formData.month2Items || []).map((item) => {
      if (item.description.includes("Automatic payment")) {
        return { ...item, date: computed.row2PayDate };
      }
      return { ...item, date: computed.row2Text };
    });

    const m3Items = (formData.month3Items || []).map((item) => ({
      ...item,
      date: computed.row3Text,
    }));

    setFormData({
      ...formData,
      customBaseDate: newDateStr,
      month2Items: m2Items.length > 0 ? m2Items : formData.month2Items,
      month3Items: m3Items.length > 0 ? m3Items : formData.month3Items,
    });
  };

  const handleSetToday = () => {
    const todayISO = new Date().toISOString().split("T")[0];
    handleBaseDateChange(todayISO);
  };

  const handleAddItem = (monthKey: "month1Items" | "month2Items" | "month3Items") => {
    const list = formData[monthKey] || [];
    const defaultDate =
      monthKey === "month1Items"
        ? dateInfo.row1Text
        : monthKey === "month2Items"
        ? dateInfo.row2Text
        : dateInfo.row3Text;

    const newItem: TransactionItem = {
      id: Date.now().toString(),
      date: defaultDate,
      description: "Earnings - AdSense for Content",
      amount: 0.0,
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
    monthKey: "month1Items" | "month2Items" | "month3Items",
    computedHeaderDate: string
  ) => {
    const items = formData[monthKey] || [];

    return (
      <div className="settings-group" style={{ backgroundColor: "#fafafa", padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#202124", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              {title}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#1a73e8", backgroundColor: "#e8f0fe", padding: "2px 8px", borderRadius: "12px" }}>
                {computedHeaderDate}
              </span>
            </h4>
          </div>
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
              Configure Transactions & History (配置近三个月交易记录明细与自定义基准日期)
            </h3>
            <span className="settings-user-pub" style={{ color: "#5f6368", fontSize: "12px" }}>
              Select a base date to auto-calculate month ranges or edit item details
            </span>
          </div>
          <button className="settings-modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="settings-modal-divider" />

        <form onSubmit={handleSave} className="settings-modal-body" style={{ gap: "16px", display: "flex", flexDirection: "column" }}>
          {/* Section 0: Custom Base Date Picker Component */}
          <div
            style={{
              backgroundColor: "#e8f0fe",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #aecbfa",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="settings-label" style={{ fontWeight: 700, color: "#1a73e8", margin: 0, fontSize: "14px" }}>
                📅 Custom Base Ending Date (自定义基准截止日期):
              </label>
              <button
                type="button"
                onClick={handleSetToday}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1a73e8",
                  border: "1px solid #1a73e8",
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset to Today (重置为今天)
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "14px", alignItems: "center" }}>
              {/* HTML5 Native Visual Date Picker Component */}
              <input
                type="date"
                value={formData.customBaseDate || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleBaseDateChange(val);
                  e.target.blur();
                }}
                onBlur={(e) => {
                  e.target.blur();
                }}
                className="settings-num-input"
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
              />

              <div style={{ fontSize: "12px", color: "#3c4043", backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #dadce0" }}>
                <span style={{ fontWeight: 600, color: "#1a73e8" }}>Auto-推断日期预览:</span>
                <div style={{ marginTop: "2px" }}>
                  M1: <strong>{dateInfo.row1Text}</strong> | M2: <strong>{dateInfo.row2Text}</strong> | M3: <strong>{dateInfo.row3Text}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Global Settings: Base Initial Starting Balance & Currency Code */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", backgroundColor: "#fafafa", padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <div>
              <label className="settings-label" style={{ fontWeight: 700, color: "#3c4043" }}>
                Base Initial Starting Balance (最底月份基准期初余额)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.initialStartingBalance ?? 0.37}
                onChange={(e) => setFormData({ ...formData, initialStartingBalance: Number(e.target.value) })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 8px", fontSize: "13px", fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label className="settings-label" style={{ fontWeight: 700, color: "#3c4043" }}>
                Currency Code (表头货币代码，如 USD, EUR)
              </label>
              <input
                type="text"
                value={formData.currencyCode || "USD"}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                className="settings-num-input"
                style={{ width: "100%", height: "34px", padding: "0 8px", fontSize: "13px", fontWeight: 700 }}
                required
              />
            </div>
          </div>

          {/* Month 1, Month 2, Month 3 Item Editors */}
          {renderMonthEditor("1. Month 1 (最新当月)", "month1Items", dateInfo.row1Text)}
          {renderMonthEditor("2. Month 2 (上个月)", "month2Items", dateInfo.row2Text)}
          {renderMonthEditor("3. Month 3 (上上个月)", "month3Items", dateInfo.row3Text)}

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
