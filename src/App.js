import React, { useEffect, useState } from 'react';
import { installPWA } from './utils/pwaInstall';

function App() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
  };

  return (
    <div>
      {/* Votre contenu existant */}
      
      {installPrompt && (
        <button 
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Installer l'application
        </button>
      )}
    </div>
  );
}

export default App; 