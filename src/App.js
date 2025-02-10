import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { installPWA } from './utils/pwaInstall';

function App() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      console.log('👋 Installation prompt triggered');
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 Application déjà installée');
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log('❌ Pas de prompt d\'installation disponible');
      return;
    }
    
    console.log('🚀 Démarrage de l\'installation...');
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`✨ Résultat de l'installation: ${outcome}`);
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-[#070907]">
      <Routes>
        {/* Vos routes existantes */}
      </Routes>

      {isInstallable && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <button 
            onClick={handleInstallClick}
            className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <span>Installer l'application</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 