import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function NotificationToast({ toast, onDismiss }) {
  if (!toast) {
    return null;
  }

  const toastType = toast.type ? toast.type : 'success';

  return (
    <div className="toast-container" id="toast-container">
      <div
        className={`toast ${toastType}`}
        onClick={onDismiss}
        role="alert"
      >
        {toastType === 'error' ? (
          <AlertCircle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default NotificationToast;
