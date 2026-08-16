import React, { useState } from "react";
import { useBrowser } from "../context/BrowserContext";

export const AdManagerSidebar: React.FC = () => {
  const { currentEntry, navigateTo, adManagerNetworkCode, adManagerDomain } = useBrowser();
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(true);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState<boolean>(true);

  const isSitesPage = currentEntry.pageId === "sites-list";
  const isPaymentsPage = currentEntry.pageId === "payments-info" || currentEntry.pageId === "transactions-service";

  const handleNavSites = () => {
    navigateTo({
      title: "Google Ad Manager - Sites",
      url: `https://admanager.google.com/${adManagerNetworkCode}#inventory/site/list`,
      pageId: "sites-list",
    });
  };

  const handleNavPayments = () => {
    navigateTo({
      title: "Google Ad Manager - Payments info",
      url: `https://admanager.google.com/${adManagerNetworkCode}#payments`,
      pageId: "payments-info",
    });
  };

  return (
    <aside className="adm-sidebar-container">
      <div className="adm-sidebar-scroll-area">
        {/* 1. Top Account Card Box (falgeldi.com / 23355001669) */}
        <div className="adm-account-card">
          <div className="adm-account-icon-box">
            <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
              business
            </i>
          </div>
          <div className="adm-account-details">
            <div className="adm-account-domain" title={adManagerDomain}>
              {adManagerDomain}
            </div>
            <div className="adm-account-id">{adManagerNetworkCode}</div>
          </div>
        </div>

        {/* Navigation List (Matching Google Ad Manager Official DOM) */}
        <ul className="adm-nav-list">
          {/* 1. Home (no-children) */}
          <li className="adm-nav-item adm-home-item">
            <span className="adm-left-arrow"></span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                home
              </i>
            </span>
            <span className="adm-nav-text">Home</span>
          </li>

          {/* 2. Sales (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                shopping_cart
              </i>
            </span>
            <span className="adm-nav-text">Sales</span>
          </li>

          {/* 3. Delivery (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                local_shipping
              </i>
            </span>
            <span className="adm-nav-text">Delivery</span>
          </li>

          {/* 4. Inventory (children - Collapsible Accordion Group) */}
          <li className="adm-submenu-group">
            <div className="adm-nav-item adm-item-header" onClick={() => setIsInventoryOpen(!isInventoryOpen)}>
              <span className="adm-left-arrow">
                <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>
                  {isInventoryOpen ? "arrow_drop_down" : "arrow_right"}
                </i>
              </span>
              <span className="adm-nav-icon">
                <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                  picture_in_picture
                </i>
              </span>
              <span className="adm-nav-text">Inventory</span>
            </div>

            {isInventoryOpen && (
              <ul className="adm-submenu-list">
                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Ad units</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Apps</span>
                </li>

                {/* Sites Submenu Item */}
                <li
                  className={`adm-submenu-item ${isSitesPage ? "active" : ""}`}
                  onClick={handleNavSites}
                >
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Sites</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Key-values</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Targeting presets</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Traffic explorer</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Traffic forecast</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Network settings</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">URLs</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Pricing rules</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Inventory rules</span>
                </li>
              </ul>
            )}
          </li>

          {/* 5. Signals (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                bigtop_updates
              </i>
            </span>
            <span className="adm-nav-text">Signals</span>
          </li>

          {/* 6. Brand safety (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                verified_user
              </i>
            </span>
            <span className="adm-nav-text">Brand safety</span>
          </li>

          {/* 7. Reporting (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                insert_chart
              </i>
            </span>
            <span className="adm-nav-text">Reporting</span>
          </li>

          {/* 8. Optimization (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                insights
              </i>
            </span>
            <span className="adm-nav-text">Optimization</span>
          </li>

          {/* 9. Privacy & messaging (no-children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow"></span>
            <span className="adm-nav-icon">
              <img
                src="https://www.gstatic.com/admanager/sidebar_icons/privacy_and_messaging.svg"
                width="18"
                height="18"
                alt=""
                style={{ display: "block" }}
              />
            </span>
            <span className="adm-nav-text">Privacy &amp; messaging</span>
          </li>

          {/* 10. Multiple Customer Management (no-children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow"></span>
            <span className="adm-nav-icon">
              <img
                src="https://www.gstatic.com/admanager/icons/MCM_203e7b688f4cc63d3be61c12776deabe.svg"
                width="18"
                height="18"
                alt=""
                style={{ display: "block" }}
              />
            </span>
            <span className="adm-nav-text">Multiple Customer Management</span>
          </li>

          {/* 11. Payments (children - Collapsible Accordion Group) */}
          <li className="adm-submenu-group">
            <div
              className={`adm-nav-item adm-item-header ${isPaymentsPage ? "active-parent" : ""}`}
              onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
            >
              <span className={`adm-left-arrow ${isPaymentsPage ? "active-blue" : ""}`}>
                <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: isPaymentsPage ? "#1a73e8" : "#5f6368" }}>
                  {isPaymentsOpen ? "arrow_drop_down" : "arrow_right"}
                </i>
              </span>
              <span className="adm-nav-icon">
                <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: isPaymentsPage ? "#1a73e8" : "#5f6368" }}>
                  payments
                </i>
              </span>
              <span className={`adm-nav-text ${isPaymentsPage ? "active-blue" : ""}`}>Payments</span>
            </div>

            {isPaymentsOpen && (
              <ul className="adm-submenu-list">
                <li
                  className={`adm-submenu-item ${isPaymentsPage ? "active" : ""}`}
                  onClick={handleNavPayments}
                >
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Payments info</span>
                </li>

                <li className="adm-submenu-item">
                  <span className="adm-solid-dot">●</span>
                  <span className="adm-sub-text">Verification check</span>
                </li>
              </ul>
            )}
          </li>

          {/* 12. Admin (children) */}
          <li className="adm-nav-item">
            <span className="adm-left-arrow">
              <i className="material-icon-i material-icons-extended" style={{ fontSize: "18px", color: "#5f6368" }}>arrow_right</i>
            </span>
            <span className="adm-nav-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "20px", color: "#5f6368" }}>
                build
              </i>
            </span>
            <span className="adm-nav-text">Admin</span>
          </li>
        </ul>
      </div>

      {/* Footer License Copyright */}
      <div className="adm-sidebar-footer">
        © 2026 Google · <a href="#privacy">Privacy Policy</a> · <a href="#help">Help</a>
      </div>
    </aside>
  );
};
