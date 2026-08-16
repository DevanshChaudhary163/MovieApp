import { useEffect } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Toast.css";

function Toast() {
  const { toast, hideToast } = useMovieContext();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type}`} onClick={hideToast}>
      <span className="toast-icon">
        {toast.type === "success" ? "✓" : "ℹ"}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={hideToast} aria-label="Close">
        ×
      </button>
    </div>
  );
}

export default Toast;
