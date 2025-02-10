import { Link } from 'react-router-dom';
import { MdMenu, MdPhoneIphone, MdAndroid } from 'react-icons/md';

export default function InstallGuide() {
  return (
    <div className="min-h-screen bg-[#070907] relative">
      {/* Header */}
      <header className="w-full py-4 px-4 md:px-8 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-white">Hi</span>
            <span className="text-emerald-500">daya</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="pt-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white px-8 py-3 bg-[#1a1a1a] rounded-full border-2 border-emerald-500 shadow-lg text-center mb-8">
            Comment installer Hidaya :)
          </h1>

          {/* iOS */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MdPhoneIphone className="text-3xl text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Installation sur iOS</h2>
            </div>
            <ol className="list-decimal list-inside text-gray-400 space-y-3">
              <li>Ouvrez Safari sur votre iPhone/iPad</li>
              <li>Accédez à l'application via le site web</li>
              <li>Appuyez sur l'icône "Partager" (le carré avec la flèche)</li>
              <li>Faites défiler et appuyez sur "Sur l'écran d'accueil"</li>
              <li>Appuyez sur "Ajouter" en haut à droite</li>
            </ol>
          </div>

          {/* Android */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MdAndroid className="text-3xl text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Installation sur Android</h2>
            </div>
            <ol className="list-decimal list-inside text-gray-400 space-y-3">
              <li>Ouvrez Chrome sur votre appareil Android</li>
              <li>Accédez à l'application via le site web</li>
              <li>Une bannière d'installation apparaîtra automatiquement</li>
              <li>Si non, appuyez sur les trois points en haut à droite</li>
              <li>Sélectionnez "Ajouter à l'écran d'accueil"</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-8 border-t border-gray-800 mt-auto">
        <div className="container mx-auto flex justify-center items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()}-SMoctarL
          </p>
        </div>
      </footer>
    </div>
  );
} 