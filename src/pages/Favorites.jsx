import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { MdMenu } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour fixe */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/quran" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 bg-[#1a1a1a] px-4 py-2 rounded-lg shadow-lg"
        >
          <MdMenu className="text-2xl" />
          <span>Retour aux sourates</span>
        </Link>
      </div>

      <div className="pt-16">
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold text-white px-8 py-3 bg-[#1a1a1a] rounded-full border-2 border-green-500 shadow-lg">
            Mes Sourates Favorites
          </h1>
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