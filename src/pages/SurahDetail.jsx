import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause, MdMenu } from 'react-icons/md';

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
        setSurah(surahResponse.data.data);

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
  }, [id]);

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
    const audioUrl = `https://server8.mp3quran.net/afs/${id.padStart(3, '0')}.mp3`;
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

  if (!surah || verses.length === 0 || translation.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-primary-500 text-xl">Chargement de la sourate...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour */}
      <div className="mb-8">
        <Link 
          to="/quran" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <MdMenu className="text-2xl" />
          <span>Retour aux sourates</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center mb-8">
        {previousSurah ? (
          <Link 
            to={`/quran/${Number(id) - 1}`} 
            className="text-gray-400 hover:text-white"
          >
            <span className="text-sm">{previousSurah.englishName}</span>
          </Link>
        ) : (
          <div className="invisible">Placeholder</div>
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{surah?.number}. {surah?.name}</h1>
          <p className="text-gray-400">{surah?.englishName}</p>
        </div>

        {nextSurah ? (
          <Link 
            to={`/quran/${Number(id) + 1}`} 
            className="text-gray-400 hover:text-white"
          >
            <span className="text-sm">{nextSurah.englishName}</span>
          </Link>
        ) : (
          <div className="invisible">Placeholder</div>
        )}
      </div>

      {/* Lecteur Audio */}
      <div className="w-full max-w-3xl mx-auto mb-12">
        <div className="mb-6">
          <p className="text-center text-gray-400 mb-2">Select reciter</p>
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <select
              className="w-full bg-transparent text-white focus:outline-none"
              defaultValue="Mishary_Rashid_Alafasy"
            >
              <option value="Mishary_Rashid_Alafasy">Yasser Al-Dossary</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={handlePreviousTrack}
            className="text-gray-400 hover:text-white text-3xl"
            disabled={Number(id) <= 1}
          >
            <MdSkipPrevious />
          </button>
          <button
            onClick={handleFullSurahPlay}
            className="text-white hover:text-green-500 text-4xl"
          >
            {isPlayingFull ? <MdPause /> : <MdPlayArrow />}
          </button>
          <button 
            onClick={handleNextTrack}
            className="text-gray-400 hover:text-white text-3xl"
            disabled={Number(id) >= 114}
          >
            <MdSkipNext />
          </button>
        </div>

        {/* Barre de progression */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-gray-400">0:00</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <span className="text-xs text-gray-400">--:--</span>
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
      <div className="space-y-8 max-w-3xl mx-auto">
        {verses.map((verse, index) => (
          <div key={verse.number} className="border-b border-gray-700 pb-6">
            <div className="flex items-start gap-4">
              <span className="text-green-500 font-medium">{verse.numberInSurah}.</span>
              <div className="flex-1">
                {/* Affichage conditionnel basé sur la langue sélectionnée */}
                {selectedLanguage === 'Arabic' ? (
                  <p className="text-2xl mb-4 text-right font-arabic leading-loose">
                    {verse.text}
                  </p>
                ) : (
                  <p className="text-gray-300 text-lg">
                    {translation[index].text}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 