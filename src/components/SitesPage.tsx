import React, { useState, useEffect } from "react";

export interface SiteItem {
  id: string;
  url: string;
  approvalStatus: "Ready" | "Getting ready" | "Requires review" | "Needs attention";
  statusDetails: string;
  adsTxtStatus: "Authorized" | "Getting ready" | "Not found";
  lastUpdatedDate: string;
  lastUpdatedTime: string;
}

const STORAGE_KEY = "adsense_sites_list";

const DEFAULT_SITES: SiteItem[] = [
  {
    id: "1",
    url: "bittlife.com",
    approvalStatus: "Ready",
    statusDetails: "—",
    adsTxtStatus: "Authorized",
    lastUpdatedDate: "Jul 21, 2025",
    lastUpdatedTime: "7:25 PM | BST",
  },
];

export const SitesPage: React.FC<{
  onNavigateToDetail?: (siteUrl: string) => void;
  onNavigateToPolicy?: () => void;
}> = ({ onNavigateToDetail, onNavigateToPolicy }) => {
  const [sites, setSites] = useState<SiteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Error reading localStorage", err);
    }
    return DEFAULT_SITES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    } catch (err) {
      console.error("Error writing localStorage", err);
    }
  }, [sites]);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newSiteUrlInput, setNewSiteUrlInput] = useState<string>("");
  const [siteToDelete, setSiteToDelete] = useState<SiteItem | null>(null);

  // Add Site Handler
  const handleAddSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newSiteUrlInput
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "");

    if (!cleanDomain) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " | BST";

    const newSite: SiteItem = {
      id: Date.now().toString(),
      url: cleanDomain,
      approvalStatus: "Ready",
      statusDetails: "—",
      adsTxtStatus: "Authorized",
      lastUpdatedDate: dateStr,
      lastUpdatedTime: timeStr,
    };

    setSites([newSite, ...sites]);
    setNewSiteUrlInput("");
    setIsAddModalOpen(false);
  };

  // Delete Site Confirm Handler
  const confirmDeleteSite = () => {
    if (!siteToDelete) return;
    setSites(sites.filter((s) => s.id !== siteToDelete.id));
    setSiteToDelete(null);
  };

  // Filtered Sites List
  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.url.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === "ready") return site.approvalStatus === "Ready";
    if (selectedFilter === "getting-ready") return site.approvalStatus === "Getting ready";
    if (selectedFilter === "requires-review") return site.approvalStatus === "Requires review";
    if (selectedFilter === "needs-attention") return site.approvalStatus === "Needs attention";

    return true;
  });

  return (
    <div className="sites-page-container">
      {/* Top Header Bar */}
      <div className="adsense-topbar">
        <h1 className="adsense-topbar-title">Sites</h1>
        <div className="adsense-topbar-right">
          <button className="topbar-icon-btn" title="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#5F6368" strokeWidth="1.8" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="#5F6368" />
            </svg>
          </button>
          <button className="topbar-icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
            </svg>
          </button>
          <div className="topbar-avatar" title="Google Account">
            <svg width="28" height="28" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#1A73E8" />
              <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
              <circle cx="16" cy="11" r="4.5" fill="#FFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="sites-page-content">
        {/* Pink Alert Banner */}
        <div className="policy-banner">
          <div className="policy-banner-left">
            <div className="banner-pager">
              <button className="pager-btn">&lt;</button>
              <span className="pager-text">1 / 2</span>
              <button className="pager-btn">&gt;</button>
            </div>
            <div className="banner-alert-icon">
              <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ color: "#d93025", fontSize: "20px", display: "inline-block", verticalAlign: "middle" }}>
                error_outline
              </i>
            </div>
            <span className="banner-text">
              The number of ads you can show has been limited for one or more of your AdSense products. For more information, go to the Policy Center.
            </span>
          </div>
          <button className="banner-action-btn" onClick={onNavigateToPolicy}>
            Policy Center
          </button>
        </div>

        {/* Divider line below Policy Banner */}
        <div className="policy-banner-divider" />

        {/* Manage Your Sites Hero */}
        <div className="manage-sites-hero">
          <div className="hero-text-side">
            <h2 className="hero-title">Manage your sites</h2>
            <p className="hero-subtitle">
              Add sites you want to monetize with AdSense.{" "}
              <a href="#learn-more" className="hero-link" onClick={(e) => e.preventDefault()}>
                Learn more about monetizing your site
              </a>
            </p>
          </div>
          <div className="hero-illustration-side">
            <img
              src="https://www.gstatic.com/display-ads-frontend-publisher-center/display-ads-frontend.publisher-center_20260805.10_p0/site_management/ads.adsense.fe.publishercenter.site_management.component.sites/images/site_management.svg"
              alt="Site management"
              style={{ height: "110px", width: "auto", display: "block" }}
            />
          </div>
        </div>

        {/* Primary Blue Action Button */}
        <div className="new-site-action-wrap">
          <button className="btn-primary-blue" onClick={() => setIsAddModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New site
          </button>
        </div>

        {/* Sites Table Container Card */}
        <div className="sites-table-card">
          {/* Table Header Controls (Search & Filter) */}
          <div className="table-controls-header">
            <div className="table-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input
                type="text"
                className="table-search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="filter-list-btn" title="Filter list">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
              </svg>
            </button>
          </div>

          {/* Filter Pills Bar */}
          <div className="filter-pills-row">
            <span className="filter-label">Filters:</span>
            <button
              className={`filter-pill ${selectedFilter === "ready" ? "active" : ""}`}
              onClick={() => setSelectedFilter(selectedFilter === "ready" ? "all" : "ready")}
            >
              Ready
            </button>
            <button
              className={`filter-pill ${selectedFilter === "getting-ready" ? "active" : ""}`}
              onClick={() => setSelectedFilter(selectedFilter === "getting-ready" ? "all" : "getting-ready")}
            >
              Getting ready
            </button>
            <button
              className={`filter-pill ${selectedFilter === "requires-review" ? "active" : ""}`}
              onClick={() => setSelectedFilter(selectedFilter === "requires-review" ? "all" : "requires-review")}
            >
              Requires review
            </button>
            <button
              className={`filter-pill ${selectedFilter === "needs-attention" ? "active" : ""}`}
              onClick={() => setSelectedFilter(selectedFilter === "needs-attention" ? "all" : "needs-attention")}
            >
              Needs attention
            </button>
          </div>

          {/* Data Table */}
          <div className="sites-data-table-wrap">
            <table className="sites-data-table">
              <thead>
                <tr>
                  <th className="col-site-url">Site URL</th>
                  <th className="col-approval">
                    Approval status{" "}
                    <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "16px", color: "#5f6368", verticalAlign: "middle", marginLeft: "2px", cursor: "pointer" }} title="Approval status info">
                      help_outline
                    </i>
                    <svg width="14" height="14" viewBox="0 0 48 48" style={{ verticalAlign: "middle", marginLeft: "4px", color: "#202124", display: "inline-block" }}>
                      <path fill="none" d="M0 0h48v48H0z"/>
                      <path fill="currentColor" d="m8 24 2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8z"/>
                    </svg>
                  </th>
                  <th className="col-details">Status details</th>
                  <th className="col-ads-txt">
                    Ads.txt status{" "}
                    <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "16px", color: "#5f6368", verticalAlign: "middle", marginLeft: "2px", cursor: "pointer" }} title="Ads.txt status info">
                      help_outline
                    </i>
                  </th>
                  <th className="col-updated">
                    Last updated{" "}
                    <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "16px", color: "#5f6368", verticalAlign: "middle", marginLeft: "2px", cursor: "pointer" }} title="Last updated info">
                      help_outline
                    </i>
                  </th>
                  <th className="col-action"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#5f6368" }}>
                      No sites found
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site) => (
                    <tr key={site.id}>
                      <td className="col-site-url">
                        <span
                          className="site-link-text"
                          onClick={() => onNavigateToDetail && onNavigateToDetail(site.url)}
                        >
                          {site.url}
                        </span>
                      </td>
                      <td className="col-approval">
                        <span className={`badge-status ${site.approvalStatus === "Ready" ? "badge-ready" : "badge-getting"}`}>
                          {site.approvalStatus}
                        </span>
                      </td>
                      <td className="col-details">
                        <span className="dash-text">{site.statusDetails}</span>
                      </td>
                      <td className="col-ads-txt">
                        <span className="badge-status badge-ready">{site.adsTxtStatus}</span>
                      </td>
                      <td className="col-updated">
                        <div className="updated-time-wrap">
                          <span className="date-line">{site.lastUpdatedDate}</span>
                          <span className="time-line">{site.lastUpdatedTime}</span>
                        </div>
                      </td>
                      <td className="col-action">
                        <button
                          className="icon-trash-btn"
                          title="Delete site"
                          onClick={() => setSiteToDelete(site)}
                        >
                          <i className="material-icon-i material-icons-extended" role="img" aria-hidden="true" style={{ fontSize: "18px", color: "#5f6368" }}>
                            delete
                          </i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination Controls */}
          <div className="table-footer-pagination">
            <div className="footer-pag-left">
              <span>Go to page:</span>
              <input type="text" className="page-input" defaultValue="1" readOnly />
              <span>of 1</span>
            </div>
            <div className="footer-pag-right">
              <span>Show rows:</span>
              <select className="rows-select" defaultValue="50">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>

              <span className="rows-count-text">
                1 - {filteredSites.length} of {filteredSites.length}
              </span>

              <div className="pag-arrows-group">
                <button className="pag-btn disabled" title="First page">&lt;|</button>
                <button className="pag-btn disabled" title="Previous page">&lt;</button>
                <button className="pag-btn disabled" title="Next page">&gt;</button>
                <button className="pag-btn disabled" title="Last page">|&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Site (Pixel Perfect to Official Screenshot) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card add-site-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="add-site-title">Add site</h3>

            <form onSubmit={handleAddSiteSubmit}>
              <div className="material-outlined-input-wrap">
                <label className="outlined-label">Website</label>
                <input
                  type="text"
                  className="outlined-input"
                  value={newSiteUrlInput}
                  onChange={(e) => setNewSiteUrlInput(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="add-site-actions">
                <button
                  type="button"
                  className="btn-text-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-solid-save"
                  disabled={!newSiteUrlInput.trim()}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Site (Pixel Perfect to Official Screenshot) */}
      {siteToDelete && (
        <div className="modal-overlay" onClick={() => setSiteToDelete(null)}>
          <div className="modal-card delete-site-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-site-title">Delete {siteToDelete.url}?</h3>
            <p className="delete-site-desc">
              Removing {siteToDelete.url} will stop AdSense ads from showing on this site and any of its subsites. Re-add {siteToDelete.url} and request a review to start displaying ads again.
            </p>

            <div className="delete-site-actions">
              <button
                type="button"
                className="btn-light-cancel"
                onClick={() => setSiteToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-text-continue"
                onClick={confirmDeleteSite}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
