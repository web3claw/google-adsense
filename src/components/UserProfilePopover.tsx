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
      className="adm-profile-popover-dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pane material-gaia-picker-popup visible">
        <div className="popup-wrapper mixin shadow visible">
          <div className="popup">
            <div className="material-popup-content content">
              <div className="main">
                <div className="selected-profile-section">
                  <div className="profile selected">
                    {/* Centered Large Avatar */}
                    <div className="profile-photo-container">
                      <div className="profile-blue-avatar-circle">
                        <svg width="78" height="78" viewBox="0 0 80 80" fill="none">
                          <circle cx="40" cy="40" r="40" fill="#8AB4F8" />
                          <circle cx="40" cy="30" r="14" fill="#1A73E8" />
                          <path
                            d="M17 64C17 51.8497 26.8497 42 39 42H41C53.1503 42 63 51.8497 63 64V68.5C63 68.7761 62.7761 69 62.5 69H17.5C17.2239 69 17 68.7761 17 68.5V64Z"
                            fill="#1A73E8"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Centered User Details */}
                    <div className="profile-details">
                      <div className="name">{userProfileName || "Sashmita Caglar"}</div>
                      <div className="email">{userProfileEmail || "sashmitacaglar@gmail.com"}</div>
                      <div className="actions">
                        <span className="account-link">
                          <a
                            className="link"
                            href="https://www.google.com/settings"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Google account
                          </a>
                        </span>
                        <span>
                          <a
                            className="link"
                            href="http://www.google.com/intl/en_US/policies/privacy/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Privacy
                          </a>
                        </span>
                      </div>

                      {/* Add Account Button in upper body */}
                      <div className="add-account-wrap">
                        <button
                          type="button"
                          className="add-account-btn"
                          onClick={onClose}
                        >
                          Add account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section with Outlined Sign out button */}
              <div className="popup-footer">
                <div className="gaia-picker-footer-btns">
                  <button
                    type="button"
                    className="profile-btn-signout"
                    onClick={onClose}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
