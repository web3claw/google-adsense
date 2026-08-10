import React from "react";
import {
  EarningsConfigData,
  TransactionItem,
  MonthBlockData,
  DEFAULT_EARNINGS_CONFIG,
} from "./EarningsConfigModal";

interface TransactionsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EarningsConfigData;
  onSaveConfig: (newConfig: EarningsConfigData) => void;
}

export function computeMonthDateInfo(baseDateStr: string | undefined, monthOffsetIndex: number) {
  let base: Date;
  if (baseDateStr && !isNaN(Date.parse(baseDateStr))) {
    base = new Date(`${baseDateStr}T12:00:00`);
  } else {
    base = new Date();
  }

  const year = base.getFullYear();
  const month = base.getMonth(); // 0-indexed
  const day = base.getDate();

  if (monthOffsetIndex === 0) {
    const mName = base.toLocaleDateString("en-US", { month: "short" });
    return `${mName} 1\u2009\u2013\u2009${day}, ${year}`;
  }

  const d = new Date(year, month - monthOffsetIndex, 1);
  const mName = d.toLocaleDateString("en-US", { month: "short" });
  const y = d.getFullYear();
  const lastDay = new Date(year, month - monthOffsetIndex + 1, 0).getDate();
  return `${mName} 1\u2009\u2013\u2009${lastDay}, ${y}`;
}

export function computeMonthPayDateInfo(baseDateStr: string | undefined, monthOffsetIndex: number) {
  let base: Date;
  if (baseDateStr && !isNaN(Date.parse(baseDateStr))) {
    base = new Date(`${baseDateStr}T12:00:00`);
  } else {
    base = new Date();
  }
  const year = base.getFullYear();
  const month = base.getMonth();
  const d = new Date(year, month - monthOffsetIndex, 1);
  const mName = d.toLocaleDateString("en-US", { month: "short" });
  const y = d.getFullYear();
  return `${mName} 21, ${y}`;
}

export const TransactionsConfigModal: React.FC<TransactionsConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = React.useState<EarningsConfigData>(() => {
    const merged = { ...DEFAULT_EARNINGS_CONFIG, ...config };

    // Initialize monthsData if not set
    if (!merged.monthsData || merged.monthsData.length === 0) {
      merged.monthsData = [
        { id: "mb-1", items: merged.month1Items || [] },
        { id: "mb-2", items: merged.month2Items || [] },
        { id: "mb-3", items: merged.month3Items || [] },
      ];
    }
    return merged;
  });

  React.useEffect(() => {
    const merged = { ...DEFAULT_EARNINGS_CONFIG, ...config };
    if (!merged.monthsData || merged.monthsData.length === 0) {
      merged.monthsData = [
        { id: "mb-1", items: merged.month1Items || [] },
        { id: "mb-2", items: merged.month2Items || [] },
        { id: "mb-3", items: merged.month3Items || [] },
      ];
    }
    setFormData(merged);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const monthsData = formData.monthsData || [];

  // When base date changes, recalculate default dates for all month items
  const handleBaseDateChange = (newDateStr: string) => {
    const updatedMonths = monthsData.map((mBlock, idx) => {
      const computedDate = computeMonthDateInfo(newDateStr, idx);
      const computedPayDate = computeMonthPayDateInfo(newDateStr, idx);

      const updatedItems = (mBlock.items || []).map((item) => {
        if (item.description.includes("Automatic payment")) {
          return { ...item, date: computedPayDate };
        }
        return { ...item, date: computedDate };
      });

      return {
        ...mBlock,
        items: updatedItems,
      };
    });

    setFormData({
      ...formData,
      customBaseDate: newDateStr,
      monthsData: updatedMonths,
    });
  };

  const handleSetToday = () => {
    const todayISO = new Date().toISOString().split("T")[0];
    handleBaseDateChange(todayISO);
  };

  // Add new Month Block at bottom (+增加一个月区块)
  const handleAddMonthBlock = () => {
    const nextIdx = monthsData.length;
    const computedDate = computeMonthDateInfo(formData.customBaseDate, nextIdx);

    const newBlock: MonthBlockData = {
      id: `mb-${Date.now()}`,
      items: [
        {
          id: `item-${Date.now()}-1`,
          date: computedDate,
          description: "Earnings - AdSense for Content",
          amount: 0.0,
        },
      ],
    };

    setFormData({
      ...formData,
      monthsData: [...monthsData, newBlock],
    });
  };

  // Remove last Month Block from bottom (-删除最后一个月区块)
  const handleRemoveMonthBlock = () => {
    if (monthsData.length <= 1) return;
    const updated = monthsData.slice(0, -1);
    setFormData({
      ...formData,
      monthsData: updated,
    });
  };

  // Add item to specific month block
  const handleAddItemToMonth = (monthIdx: number) => {
    const defaultDate = computeMonthDateInfo(formData.customBaseDate, monthIdx);
    const newItem: TransactionItem = {
      id: Date.now().toString(),
      date: defaultDate,
      description: "Earnings - AdSense for Content",
      amount: 0.0,
    };

    const updatedMonths = [...monthsData];
    updatedMonths[monthIdx] = {
      ...updatedMonths[monthIdx],
      items: [...(updatedMonths[monthIdx].items || []), newItem],
    };

    setFormData({
      ...formData,
      monthsData: updatedMonths,
    });
  };

  // Update item in specific month block
  const handleUpdateItem = (
    monthIdx: number,
    itemIdx: number,
    field: keyof TransactionItem,
    val: string | number
  ) => {
    const updatedMonths = [...monthsData];
    const items = [...(updatedMonths[monthIdx].items || [])];
    items[itemIdx] = {
      ...items[itemIdx],
      [field]: val,
    };
    updatedMonths[monthIdx] = {
      ...updatedMonths[monthIdx],
      items,
    };

    setFormData({
      ...formData,
      monthsData: updatedMonths,
    });
  };

  // Delete item from specific month block
  const handleDeleteItem = (monthIdx: number, itemIdx: number) => {
    const updatedMonths = [...monthsData];
    const items = [...(updatedMonths[monthIdx].items || [])];
    items.splice(itemIdx, 1);
    updatedMonths[monthIdx] = {
      ...updatedMonths[monthIdx],
      items,
    };

    setFormData({
      ...formData,
      monthsData: updatedMonths,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform N-Month mathematical balance chain calculation
    const N = monthsData.length;
    const initialStart = Number(formData.initialStartingBalance) || 0;

    let currentStart = initialStart;
    const monthBalances: { start: number; end: number; sum: number }[] = new Array(N);

    // Calculate from bottom (earliest month N-1) to top (latest month 0)
    for (let i = N - 1; i >= 0; i--) {
      const items = monthsData[i].items || [];
      const sum = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
      const start = currentStart;
      const end = Number((start + sum).toFixed(2));
      monthBalances[i] = { start, end, sum };
      currentStart = end;
    }

    const latestEnd = N > 0 ? monthBalances[0].end : 0.42;

    const updatedConfig: EarningsConfigData = {
      ...formData,
      monthsData,
      currentEarnings: latestEnd,
      augAmount: N > 0 ? (monthBalances[0].sum !== 0 ? Math.abs(monthBalances[0].sum) : 0.42) : 0.42,
      julAmount: N > 1 ? (monthsData[1].items.find((i) => i.amount > 0)?.amount ?? 0.42) : 0.42,
      junAmount: N > 2 ? (monthsData[2].items.find((i) => i.amount > 0)?.amount ?? 392.47) : 392.47,
    };

    onSaveConfig(updatedConfig);
    onClose();
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
              Configure Transactions & History ({monthsData.length} 个月交易记录配置与基准日期)
            </h3>
            <span className="settings-user-pub" style={{ color: "#5f6368", fontSize: "12px" }}>
              Dynamic N-Month blocks • Auto balance chain • Add/Delete month blocks
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
                <span style={{ fontWeight: 600, color: "#1a73e8" }}>Auto-推断最新月份预览:</span>
                <div style={{ marginTop: "2px" }}>
                  Month 1: <strong>{computeMonthDateInfo(formData.customBaseDate, 0)}</strong> | Month 2: <strong>{computeMonthDateInfo(formData.customBaseDate, 1)}</strong>
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

          {/* Dynamic Month Editors List */}
          {monthsData.map((mBlock, mIdx) => {
            const computedHeaderDate = computeMonthDateInfo(formData.customBaseDate, mIdx);
            const titleLabel = mIdx === 0 ? "Month 1 (最新当月)" : `Month ${mIdx + 1} (前 ${mIdx} 个月)`;
            const items = mBlock.items || [];

            return (
              <div key={mBlock.id || mIdx} className="settings-group" style={{ backgroundColor: "#fafafa", padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#202124", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      {titleLabel}
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#1a73e8", backgroundColor: "#e8f0fe", padding: "2px 8px", borderRadius: "12px" }}>
                        {computedHeaderDate}
                      </span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItemToMonth(mIdx)}
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
                    {items.map((item, itemIdx) => (
                      <div
                        key={item.id || itemIdx}
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
                            onChange={(e) => handleUpdateItem(mIdx, itemIdx, "date", e.target.value)}
                            style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#5f6368", display: "block", marginBottom: "2px" }}>Description (描述):</span>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(mIdx, itemIdx, "description", e.target.value)}
                            style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#5f6368", display: "block", marginBottom: "2px" }}>Amount (金额):</span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.amount}
                            onChange={(e) => handleUpdateItem(mIdx, itemIdx, "amount", Number(e.target.value))}
                            style={{ width: "100%", height: "32px", padding: "0 8px", fontSize: "13px", border: "1px solid #ccc", borderRadius: "4px" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(mIdx, itemIdx)}
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
          })}

          {/* Option B: Dynamic Month Block Control Buttons (+ Add Month / - Delete Month) */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 0",
              borderTop: "1px dashed #dadce0",
              borderBottom: "1px dashed #dadce0",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
            }}
          >
            <button
              type="button"
              onClick={handleAddMonthBlock}
              style={{
                backgroundColor: "#e8f0fe",
                color: "#1a73e8",
                border: "1px solid #1a73e8",
                borderRadius: "6px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              + Add Month (+增加一个月区块)
            </button>

            {monthsData.length > 1 && (
              <button
                type="button"
                onClick={handleRemoveMonthBlock}
                style={{
                  backgroundColor: "#fce8e6",
                  color: "#d93025",
                  border: "1px solid #d93025",
                  borderRadius: "6px",
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                - Delete Month (-删除最后一个月)
              </button>
            )}
          </div>

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
