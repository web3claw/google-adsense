import React, { useEffect, useRef } from "react";
import { useBrowser } from "../context/BrowserContext";

export const UserProfilePopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { userProfileName, userProfileEmail } = useBrowser();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="as-profile-popover-dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="as-profile-content">
        {/* Selected Profile Section */}
        <div className="selected-profile-section">
          <div className="profile-photo-container">
            <svg width="48" height="48" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#4285F4" />
              <path d="M16 18c-3.5 0-10 1.75-10 5.25V26h20v-2.75C26 19.75 19.5 18 16 18z" fill="#FFF" />
              <circle cx="16" cy="11" r="4.5" fill="#FFF" />
            </svg>
          </div>

          <div className="profile-details">
            <div className="profile-name" title={userProfileName}>
              {userProfileName}
            </div>
            <div className="profile-email" title={userProfileEmail}>
              {userProfileEmail}
            </div>
            <div className="profile-actions">
              <a
                href="https://myaccount.google.com/u/0"
                target="_blank"
                rel="noreferrer"
                className="my-account-link"
              >
                My account
              </a>
            </div>
          </div>
        </div>

        {/* Footer Buttons Section */}
        <div className="as-gaia-buttons">
          <button className="mdc-button profile-btn-action" onClick={onClose}>
            Add account
          </button>
          <button className="mdc-button profile-btn-action" onClick={onClose}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
