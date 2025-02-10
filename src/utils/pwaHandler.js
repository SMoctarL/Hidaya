let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  // Force le mode plein écran après l'installation
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
});

// Vérifier si l'app est lancée depuis l'écran d'accueil
if (window.matchMedia('(display-mode: fullscreen)').matches) {
  document.documentElement.requestFullscreen().catch(err => {
    console.log('Erreur mode plein écran:', err);
  });
} 