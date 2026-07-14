import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const NotificationBanner = () => {
  const { errorNotification, setErrorNotification } = useAuth();

  if (!errorNotification) return null;

  const isError = errorNotification.type === 'error';

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full shadow-2xl px-4 animate-slide-in">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all ${
        isError 
          ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' 
          : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex-shrink-0 mt-0.5">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div className="flex-1 text-sm font-medium">
          <p className="leading-relaxed">{errorNotification.message}</p>
        </div>
        <button 
          onClick={() => setErrorNotification(null)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4 opacity-75" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
