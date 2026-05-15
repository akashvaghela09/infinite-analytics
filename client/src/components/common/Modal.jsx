import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClasses[size]} bg-[#111811] border border-[#1e3a1e] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transform transition-all`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a1e]">
            <h3 className="text-lg font-semibold text-[#e8f5e9]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#81c784] hover:text-[#e8f5e9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
