import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: ToastData; onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(onDone, 300);
      return () => clearTimeout(timer);
    }
  }, [exiting, onDone]);

  const colorMap = {
    success: { bg: '#e8c060', text: '#08080c', icon: '✓' },
    error: { bg: '#f87171', text: '#fff', icon: '✕' },
    info: { bg: '#60a5fa', text: '#fff', icon: 'ℹ' },
  };

  const { bg, text, icon } = colorMap[toast.type];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: bg,
        color: text,
        padding: '12px 20px',
        borderRadius: '12px',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '14px',
        letterSpacing: '1px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        animation: exiting ? 'toastExit 0.3s ease-in forwards' : 'toastEnter 0.3s ease-out forwards',
        cursor: 'pointer',
        maxWidth: '380px',
      }}
      onClick={() => setExiting(true)}
    >
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{icon}</span>
      {toast.message}
    </div>
  );
}
