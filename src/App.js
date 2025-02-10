import { installPWA } from './utils/pwaInstall';

// Dans votre composant
const handleInstall = async () => {
  const installed = await installPWA();
  if (installed) {
    // L'application a été installée
  }
};

// Ajoutez un bouton quelque part dans votre interface
<button onClick={handleInstall}>
  Installer l'application
</button> 