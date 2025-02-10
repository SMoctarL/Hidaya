import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CitySelector from '../components/CitySelector';
import PrayerCard from '../components/PrayerCard';

const CITIES = {
  position: { name: 'Ma position' },
  dakar: { lat: 14.7167, lng: -17.4677, name: 'Dakar' },
  thies: { lat: 14.7910, lng: -16.9359, name: 'Thies' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  toronto: { lat: 43.6532, lng: -79.3832, name: 'Toronto' },
  newJersey: { lat: 40.0583, lng: -74.4057, name: 'New Jersey' }
};

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [selectedCity, setSelectedCity] = useState('dakar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoError(null);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setGeoError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur");
    }
  };

  const fetchPrayerTimes = async (city) => {
    setLoading(true);
    setError(null);
    try {
      let coordinates;

      if (city === 'position') {
        coordinates = await getUserLocation();
      } else {
        coordinates = CITIES[city];
      }

      const response = await axios.get(
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}`,
        {
          params: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            method: 2
          }
        }
      );
      setPrayerTimes(response.data.data.timings);
    } catch (error) {
      console.error('Erreur:', error);
      setError(typeof error === 'string' ? error : 'Erreur lors de la récupération des horaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    // Fonction pour obtenir la position
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setGeoError(null);
          },
          (error) => {
            console.error('Erreur de géolocalisation:', error);
            setGeoError(error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        setGeoError("La géolocalisation n'est pas supportée par votre navigateur");
      }
    };

    // Si l'utilisateur sélectionne "Ma position"
    const handlePositionSelection = () => {
      // Demander la permission si nécessaire
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            getUserLocation();
          }
        });
      } else {
        getUserLocation();
      }
    };

    // Ajouter un écouteur d'événements pour la sélection de ville
    const citySelect = document.querySelector('select[name="city"]');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        if (e.target.value === 'position') {
          handlePositionSelection();
        }
      });
    }

    return () => {
      // Nettoyage des écouteurs d'événements
      if (citySelect) {
        citySelect.removeEventListener('change', handlePositionSelection);
      }
    };
  }, []);

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-[#070907] text-white">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070907]/95 backdrop-blur-sm py-4 px-4 md:px-8 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-white">Hi</span>
            <span className="text-emerald-500">daya</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link to="/quran" className="text-white hover:text-emerald-400 transition-colors">
              Sourates
            </Link>
            <Link to="/install" className="text-white hover:text-emerald-400 transition-colors">
              Installer
            </Link>
            {/* Menu déroulant des réseaux sociaux */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-emerald-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>

              {/* Menu déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#121212] ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <a
                      href="https://x.com/Smocskill"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                      Twitter
                    </a>
                    <a
                      href="https://www.instagram.com/smoctar_lo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                      </svg>
                      Instagram
                    </a>
                    <a
                      href="https://github.com/SMoctarL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Ajout d'un espace pour compenser le header fixe */}
      <div className="pt-24">
        {/* Contenu principal */}
        <main className="container mx-auto px-2 md:px-4 pt-8 md:pt-16 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
            
            {/* Section principale */}
            <div className="w-full md:w-2/3 max-w-4xl mx-auto order-2 md:order-1">
              <div className="rounded-2xl md:rounded-3xl bg-gradient-to-bl from-[#1a2e1a]/90 via-[#0d1810]/90 to-[#070907]/90 backdrop-blur-sm p-6 md:p-12">
                {/* Ramadan Kareem en haut */}
                <div className="text-center mb-4 md:mb-6">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-emerald-400">Ramadan Kareem</span>
                    <span className="text-yellow-400">🌙</span>
                  </div>
                </div>

                {/* Titre principal */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6 md:mb-8 
                             text-white leading-tight drop-shadow-2xl">
                  Découvrez la sagesse du Coran, une lumière pour votre quotidien
                </h1>
                
                {/* Texte descriptif */}
                <p className="text-sm md:text-base lg:text-lg text-gray-300/90 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
                  Explorez la beauté des versets, leur signification profonde et laissez-vous guider par 
                  les enseignements intemporels du Saint Coran
                </p>

                {/* Bouton Sourates */}
                <div className="text-center">
                  <Link
                    to="/quran"
                    className="inline-block px-6 md:px-8 py-2.5 md:py-3 text-base md:text-lg font-medium text-white 
                             bg-emerald-500 hover:bg-emerald-600 rounded-lg
                             transition-colors duration-300"
                  >
                    Sourates
                  </Link>
                </div>
              </div>
            </div>

            {/* Horaires de prière */}
            <div className="w-full md:w-1/3 max-w-full md:max-w-[300px] order-1 md:order-2">
              <div className="bg-[#121212] rounded-xl p-4 md:p-6 shadow-lg">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Horaires des prières à {CITIES[selectedCity]?.name || '...'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).replace(/^\w/, c => c.toUpperCase())}
                  </p>
                </div>
                
                {/* Cartes de prière en colonne */}
                <div className="flex flex-col gap-1 mb-4">
                  {prayerTimes && (
                    <div className="grid grid-cols-1 text-[13px]">
                      <div className="flex justify-between items-center py-1 px-4">
                        <span className="text-gray-300">Fajr</span>
                        <span className="text-gray-400">{prayerTimes.Fajr}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-4">
                        <span className="text-gray-300">Dhuhr</span>
                        <span className="text-gray-400">{prayerTimes.Dhuhr}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-4">
                        <span className="text-gray-300">Asr</span>
                        <span className="text-gray-400">{prayerTimes.Asr}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-4">
                        <span className="text-gray-300">Maghrib</span>
                        <span className="text-gray-400">{prayerTimes.Maghrib}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-4">
                        <span className="text-gray-300">Isha</span>
                        <span className="text-gray-400">{prayerTimes.Isha}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sélection de ville */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg bg-black/40 text-gray-300 
                             border-none focus:ring-0 outline-none"
                  >
                    {Object.entries(CITIES).map(([city, data]) => (
                      <option key={city} value={city}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Section Oustaz Omar Thioune */}
          <div className="mx-auto max-w-md w-full mb-8">
            <div className="bg-gradient-to-bl from-yellow-500/30 via-yellow-600/20 to-transparent rounded-2xl overflow-hidden shadow-lg">
              <div className="relative z-10">
                <p className="text-lg py-4 text-white-300 text-center">Suivez l'integralité du Ramadan et bien plus avec Oustaz Omar Thioune</p>
                <a 
                  href="https://www.youtube.com/@oumoulkhouratv7143" 
                  target="_blank" 
                  rel="noopener noreferrer"

                  className="block hover:opacity-90 transition-opacity"

                >
                  <img 
                    src="smoctarl.jpg" 
                    alt="SMoctarL" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <span className="text-sm text-gray-400">@Oustaz Omar Thioune</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
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