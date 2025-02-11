import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause, MdMenu } from 'react-icons/md';
import { FaHeart, FaRegHeart, FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';

const RECITERS = {
  'ar.alafasy': 'Mishary Rashid Alafasy',
  'ar.abdulbasitmurattal': 'Abdul Basit Murattal',
  'ar.abdullahbasfar': 'Abdullah Basfar'
};

export default function SurahDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const audioRef = useRef(null);
  const fullSurahAudioRef = useRef(null);
  const [previousSurah, setPreviousSurah] = useState(null);
  const [nextSurah, setNextSurah] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Arabic');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressInterval = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const fetchSurahDetails = async () => {
      try {
        // Réinitialiser les states audio
        if (fullSurahAudioRef.current) {
          fullSurahAudioRef.current.pause();
          setIsPlayingFull(false);
        }
        if (audioRef.current) {
          audioRef.current.pause();
          setPlayingVerse(null);
        }

        // Récupérer les détails de la sourate actuelle
        const surahResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${id}`);
        setSurah({
          ...surahResponse.data.data,
          audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/${selectedReciter}/${id}.mp3`
        });

        // Récupérer les versets en arabe
        const arabicResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`);
        setVerses(arabicResponse.data.data.ayahs);

        // Récupérer la traduction française
        const frenchResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${id}/fr.hamidullah`);
        setTranslation(frenchResponse.data.data.ayahs);

        // Récupérer les détails des sourates précédente et suivante
        if (Number(id) > 1) {
          const prevResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${Number(id) - 1}`);
          setPreviousSurah(prevResponse.data.data);
        } else {
          setPreviousSurah(null);
        }
        
        if (Number(id) < 114) {
          const nextResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${Number(id) + 1}`);
          setNextSurah(nextResponse.data.data);
        } else {
          setNextSurah(null);
        }

      } catch (error) {
        console.error('Erreur lors du chargement de la sourate:', error);
      }
    };

    fetchSurahDetails();
    
    // Nettoyage des audios lors du démontage du composant
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (fullSurahAudioRef.current) {
        fullSurahAudioRef.current.pause();
      }
    };
  }, [id, selectedReciter]);

  // Réinitialiser la lecture quand la sourate ou le récitateur change
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  }, [id, selectedReciter]);

  const handleFullSurahPlay = () => {
    // Arrêter la lecture d'un verset individuel si en cours
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingVerse(null);
    }

    // Si la sourate est déjà en cours de lecture
    if (isPlayingFull && fullSurahAudioRef.current) {
      fullSurahAudioRef.current.pause();
      fullSurahAudioRef.current.currentTime = 0;
      setIsPlayingFull(false);
      return;
    }

    // Utiliser une URL différente pour la sourate complète
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${selectedReciter}/${id}.mp3`;
    const audio = new Audio(audioUrl);
    fullSurahAudioRef.current = audio;

    audio.onended = () => {
      setIsPlayingFull(false);
    };

    audio.onerror = (e) => {
      console.error('Erreur de chargement audio:', e);
      setIsPlayingFull(false);
      alert('Erreur lors du chargement de la récitation. Veuillez réessayer.');
    };

    audio.play().catch(error => {
      console.error('Erreur de lecture:', error);
      setIsPlayingFull(false);
    });
    
    setIsPlayingFull(true);
  };

  const handleVersePlay = (verseAudio, verseNumber) => {
    // Arrêter la lecture de la sourate complète si en cours
    if (fullSurahAudioRef.current) {
      fullSurahAudioRef.current.pause();
      fullSurahAudioRef.current.currentTime = 0;
      setIsPlayingFull(false);
    }

    // Si un audio est déjà en cours de lecture, on l'arrête
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Si on clique sur le même verset, on arrête simplement la lecture
      if (playingVerse === verseNumber) {
        setPlayingVerse(null);
        return;
      }
    }

    // Création d'un nouvel audio pour le verset
    const audio = new Audio(verseAudio);
    audioRef.current = audio;
    
    // Quand l'audio se termine
    audio.onended = () => {
      setPlayingVerse(null);
    };

    // Lecture du nouveau verset
    audio.play();
    setPlayingVerse(verseNumber);
  };

  const handlePreviousTrack = () => {
    if (Number(id) > 1) {
      // Arrêter l'audio en cours
      if (fullSurahAudioRef.current) {
        fullSurahAudioRef.current.pause();
        setIsPlayingFull(false);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingVerse(null);
      }
      navigate(`/quran/${Number(id) - 1}`);
    }
  };

  const handleNextTrack = () => {
    if (Number(id) < 114) {
      // Arrêter l'audio en cours
      if (fullSurahAudioRef.current) {
        fullSurahAudioRef.current.pause();
        setIsPlayingFull(false);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingVerse(null);
      }
      navigate(`/quran/${Number(id) + 1}`);
    }
  };

  const handleReciterChange = (event) => {
    setSelectedReciter(event.target.value);
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Formater le temps en hh:mm:ss ou mm:ss selon la durée
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Démarrer la mise à jour de la progression
  const startProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        if (!isNaN(current) && !isNaN(duration) && duration > 0) {
          setCurrentTime(current);
          const progressPercent = (current / duration) * 100;
          setProgress(progressPercent);
        }
      }
    }, 100);
  };

  // Arrêter la mise à jour de la progression
  const stopProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  // Gérer le play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        stopProgressUpdate();
      } else {
        audioRef.current.play()
          .then(() => {
            startProgressUpdate();
          })
          .catch(error => {
            console.error('Erreur de lecture:', error);
            setIsPlaying(false);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Gérer le chargement initial de l'audio
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (!isNaN(duration)) {
        setDuration(duration);
      }
    }
  };

  // Fonctions de navigation
  const goToPreviousSurah = () => {
    const prevId = parseInt(id) - 1;
    if (prevId >= 1) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setProgress(0);
      navigate(`/quran/${prevId}`);
    }
  };

  const goToNextSurah = () => {
    const nextId = parseInt(id) + 1;
    if (nextId <= 114) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setProgress(0);
      navigate(`/quran/${nextId}`);
    }
  };

  // Fonction pour calculer la nouvelle position
  const calculateNewPosition = (e) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const newProgress = Math.max(0, Math.min(100, (clickPosition / progressBarWidth) * 100));
      const newTime = (audioRef.current.duration * newProgress) / 100;
      
      setProgress(newProgress);
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  // Gérer le clic sur la barre
  const handleProgressClick = (e) => {
    calculateNewPosition(e);
  };

  // Gérer le début du glissement
  const handleMouseDown = (e) => {
    setIsDragging(true);
    calculateNewPosition(e);
  };

  // Gérer le glissement
  const handleMouseMove = (e) => {
    if (isDragging) {
      calculateNewPosition(e);
    }
  };

  // Gérer la fin du glissement
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Ajouter/Supprimer les écouteurs d'événements pour le glissement
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Mettre à jour la progression
  useEffect(() => {
    if (audioRef.current && surah?.audioUrl) {
      audioRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [surah?.audioUrl]);

  // Nettoyer les intervalles
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!surah || verses.length === 0 || translation.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-primary-500 text-xl">Chargement de la sourate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070907] text-white">
      <div className="container mx-auto px-4 py-8">

        {/* Navigation avec flèches */}
        <div className="w-full flex justify-between items-center mb-8 pt-16">
          {previousSurah ? (
            <Link 
              to={`/quran/${Number(id) - 1}`} 
              className="text-gray-400 hover:text-white flex items-center gap-2 group"
            >
              <MdSkipPrevious className="text-3xl transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">{previousSurah.englishName}</span>
            </Link>
          ) : (
            <div className="invisible">Placeholder</div>
          )}
          
          <div className="text-center">
            <div className="flex items-center px-6 mb-4">
              {/* Bouton retour à gauche */}
              <Link to="/quran" className="text-white hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>

              {/* Titre */}
              <h1 className="text-3xl text-white font-bold ml-4">
                {surah?.number}. {surah?.name}
              </h1>
            </div>
            <div className="flex justify-center mb-6">
              <p className="text-white px-6 py-2 bg-[#1a1a1a] rounded-full border-2 border-green-500 shadow-lg inline-block">
                {surah?.englishName}
              </p>
            </div>
            <button
              onClick={() => isFavorite(surah?.number) 
                ? removeFavorite(surah?.number) 
                : addFavorite(surah)
              }
              className="mt-2 hover:scale-110 transition-transform duration-200"
            >
              {isFavorite(surah?.number) 
                ? <FaHeart className="text-2xl text-green-500" />
                : <FaRegHeart className="text-2xl text-gray-400 hover:text-white" />
              }
            </button>
          </div>

          {nextSurah ? (
            <Link 
              to={`/quran/${Number(id) + 1}`} 
              className="text-gray-400 hover:text-white flex items-center gap-2 group"
            >
              <span className="text-sm">{nextSurah.englishName}</span>
              <MdSkipNext className="text-3xl transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div className="invisible">Placeholder</div>
          )}
        </div>

        {/* Sélecteur de récitateur */}
        <div className="px-4 mb-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1a1a1a] p-4 rounded-2xl">
              <label className="block text-gray-300 mb-2 text-center">Select reciter</label>
              <select
                value={selectedReciter}
                onChange={handleReciterChange}
                className="w-full p-3 rounded-lg bg-[#262626] text-white border border-gray-700 focus:border-green-500 focus:outline-none text-center"
              >
                {Object.entries(RECITERS).map(([value, name]) => (
                  <option key={value} value={value} className="text-center">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contrôles de lecture et barre de progression */}
        <div className="px-4 mb-6">
          <div className="max-w-2xl mx-auto">
            <div className="w-full flex items-center gap-4">
              {/* Bouton précédent */}
              <button
                onClick={() => navigate(`/quran/${parseInt(id) - 1}`)}
                disabled={parseInt(id) <= 1}
                className={`text-gray-400 ${parseInt(id) <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-green-500'}`}
              >
                <FaStepBackward size={20} />
              </button>
              
              {/* Bouton play/pause */}
              <button
                onClick={togglePlay}
                className="text-gray-400 hover:text-green-500"
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>

              {/* Bouton suivant */}
              <button
                onClick={() => navigate(`/quran/${parseInt(id) + 1}`)}
                disabled={parseInt(id) >= 114}
                className={`text-gray-400 ${parseInt(id) >= 114 ? 'opacity-50 cursor-not-allowed' : 'hover:text-green-500'}`}
              >
                <FaStepForward size={20} />
              </button>

              {/* Temps et barre de progression */}
              <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
              
              <div 
                ref={progressBarRef}
                className="flex-1 h-1 bg-gray-700 rounded-full relative cursor-pointer"
                onClick={handleProgressClick}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <div 
                  className="h-full bg-green-500 rounded-full absolute top-0 left-0"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-sm text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Onglets de langue modifiés */}
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setSelectedLanguage('Arabic')}
              className={`px-4 py-2 ${
                selectedLanguage === 'Arabic' 
                  ? 'text-green-500 border-b-2 border-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Arabic
            </button>
            <button
              onClick={() => setSelectedLanguage('French')}
              className={`px-4 py-2 ${
                selectedLanguage === 'French' 
                  ? 'text-green-500 border-b-2 border-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Versets modifiés */}
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {verses.map((verse, index) => (
              <div key={verse.number} className="border-b border-gray-700 pb-6">
                <div className="flex items-start gap-4">
                  <span className="text-green-500 font-medium">{verse.numberInSurah}.</span>
                  <div className="flex-1">
                    {/* Affichage conditionnel basé sur la langue sélectionnée */}
                    {selectedLanguage === 'Arabic' ? (
                      <p className="text-2xl mb-4 text-right font-arabic leading-loose text-white">
                        {verse.text}
                      </p>
                    ) : (
                      <p className="text-white text-lg">
                        {translation[index].text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={surah?.audioUrl}
        className="hidden"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          stopProgressUpdate();
          setIsPlaying(false);
        }}
        onError={(e) => {
          console.error('Erreur audio:', e);
          setIsPlaying(false);
        }}
      />
    </div>
  );
} 