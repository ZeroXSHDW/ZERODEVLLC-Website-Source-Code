"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          fontSize: "14px",
        },
        className: "backdrop-blur-sm",
      }}
      richColors
      closeButton
    />
  );
}
