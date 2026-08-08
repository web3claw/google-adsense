import React, { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    try {
      const appWindow = getCurrentWindow();
      appWindow.isMaximized().then(setIsMaximized);

      // Listen for window resize events to update maximize state
      const unlisten = appWindow.onResized(async () => {
        setIsMaximized(await appWindow.isMaximized());
      });

      return () => {
        unlisten.then((fn) => fn());
      };
    } catch (e) {
      console.warn("Tauri window API non-desktop context", e);
    }
  }, []);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const appWindow = getCurrentWindow();
      appWindow.minimize();
    } catch (err) {
      console.warn("Minimize error", err);
    }
  };

  const handleMaximize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const appWindow = getCurrentWindow();
      await appWindow.toggleMaximize();
      setIsMaximized(await appWindow.isMaximized());
    } catch (err) {
      console.warn("Maximize error", err);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const appWindow = getCurrentWindow();
      appWindow.close();
    } catch (err) {
      console.warn("Close error", err);
    }
  };

  return (
    <div
      className="chrome-window-controls"
      data-tauri-drag-region={false}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Minimize */}
      <button
        className="chrome-win-btn minimize"
        onClick={handleMinimize}
        title="Minimize"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="5.5" width="8" height="1" fill="currentColor" />
        </svg>
      </button>

      {/* Maximize / Restore */}
      <button
        className="chrome-win-btn maximize"
        onClick={handleMaximize}
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? (
          // Restore Icon (2 overlapping boxes)
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3.5 3.5H9.5V9.5H3.5V3.5Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M5 2H10.5V7.5" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        ) : (
          // Maximize Icon (single box)
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2.5" y="2.5" width="7" height="7" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        )}
      </button>

      {/* Close */}
      <button
        className="chrome-win-btn close"
        onClick={handleClose}
        title="Close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};
