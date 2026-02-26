'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Store in localStorage to not show again for 7 days
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  // Don't show if already standalone or prompt was dismissed recently
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50 animate-fade-in">
      <div className="bg-gray-900 text-white rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xl">🌾</span>
            </div>
            <div>
              <div className="font-bold">Install AgriHub App</div>
              <div className="text-sm text-gray-300">Akses lebih cepat & bisa offline</div>
            </div>
          </div>
          <button
            onClick={handleClosePrompt}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        {isIOS ? (
          <div className="mt-3 text-sm text-gray-300">
            <p>Tap <span className="font-bold">􀈂</span> lalu "Add to Home Screen"</p>
          </div>
        ) : (
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-300">
              Cukup 1 tap untuk install
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Install App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}