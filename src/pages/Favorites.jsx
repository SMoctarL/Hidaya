import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { MdMenu } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">


      <div className="pt-16">
        <div className="flex items-center justify-between px-6 mb-8">
          {/* Bouton retour à gauche */}
          <Link to="/quran" className="text-white hover:text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-white px-8 py-3 bg-[#1a1a1a] rounded-full border-2 border-green-500 shadow-lg">
            Mes Sourates Favorites
          </h1>

          {/* Élément vide pour maintenir le centrage */}
          <div className="w-6"></div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map(surah => (
            <div key={surah.number} className="bg-[#1a1a1a] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <Link 
                  to={`/quran/${surah.number}`} 
                  className="flex-1 hover:text-green-500 transition-colors duration-200"
                >
                  <h2 className="text-xl text-white">{surah.name}</h2>
                  <p className="text-gray-400">{surah.englishName}</p>
                </Link>
                <button
                  onClick={() => removeFavorite(surah.number)}
                  className="text-green-500 hover:scale-110 transition-transform duration-200"
                >
                  <FaHeart className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {favorites.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>Aucune sourate en favoris</p>
            <Link 
              to="/quran" 
              className="text-green-500 hover:text-green-400 mt-2 inline-block"
            >
              Parcourir les sourates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 