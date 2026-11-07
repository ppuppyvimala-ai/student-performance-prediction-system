import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  className?: string;
  variant?: 'navbar' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as installed standalone PWA, render a subtle indicator badge or nothing
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PWA Installed</span>
        <span className="sm:hidden">App</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all ${className}`}
        title="Install as Progressive Web App"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (iPad / iPhone)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all ${className}`}
          title="Install on iPad / iPhone"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install on iPad / iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Install on iPad & iPhone</h3>
                  <p className="text-xs text-slate-500">Run as full-screen standalone application</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</div>
                  <p className="pt-0.5">
                    Tap the <strong className="text-slate-800 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-indigo-600" /> Share</strong> button in Safari's top toolbar or navigation bar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</div>
                  <p className="pt-0.5">
                    Scroll down and select <strong className="text-slate-800 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-indigo-600" /> Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">3</div>
                  <p className="pt-0.5">
                    Confirm by tapping <strong className="text-slate-800">Add</strong>. Open the app directly from your home screen dock!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-98 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop browsers without beforeinstallprompt triggered yet
  return (
    <button
      onClick={() => alert('To install, open this application in Google Chrome, Edge, or Safari, and click the install icon in your address bar or browser menu.')}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition ${className}`}
      title="Install App"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install PWA</span>
    </button>
  );
};
