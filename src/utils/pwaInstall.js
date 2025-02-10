let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Montrer le bouton d'installation si disponible
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

export const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Installation ${outcome}`);
    deferredPrompt = null;
  }
};

// Vérifier si l'app est déjà installée
window.addEventListener('appinstalled', () => {
  console.log('Application installée');
  deferredPrompt = null;
}); 