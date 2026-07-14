import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastManager() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (event) => {
      const { message, type = 'error', duration = 4000 } = event.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('antigravity-toast', handleToastEvent);
    return () => {
      window.removeEventListener('antigravity-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full"
          >
            <div className={`p-4 rounded-xl border glass-panel-heavy shadow-2xl flex items-start gap-3 overflow-hidden relative
              ${toast.type === 'success' ? 'border-emerald-500/30 shadow-emerald-950/20' : 
                toast.type === 'warning' ? 'border-amber-500/30 shadow-amber-950/20' : 
                'border-rose-500/30 shadow-rose-950/20'}`}
            >
              {/* Left Color Indicator Strip */}
              <div className={`absolute top-0 left-0 w-1.5 h-full 
                ${toast.type === 'success' ? 'bg-emerald-500' : 
                  toast.type === 'warning' ? 'bg-amber-500' : 
                  'bg-rose-500'}`} 
              />

              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
              </div>

              <div className="flex-grow pl-1">
                <h4 className="text-sm font-semibold font-display tracking-wide text-white">
                  {toast.type === 'success' ? 'Success' : 
                   toast.type === 'warning' ? 'Warning' : 
                   'Notice'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
