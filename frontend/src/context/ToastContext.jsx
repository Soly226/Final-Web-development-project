import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Global Stacked Toast Container */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={twMerge(
      'flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 opacity-100 text-white pointer-events-auto animate-fade-in-up',
      toast.type === 'success'
        ? 'bg-emerald-500/90 border-emerald-400/30'
        : 'bg-rose-500/90 border-rose-400/30'
    )}>
      <span className="material-symbols-outlined text-xl shrink-0">
        {toast.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span className="text-sm font-bold leading-tight">{toast.message}</span>
      <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100 transition-opacity shrink-0">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};
