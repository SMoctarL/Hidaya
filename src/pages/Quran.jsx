import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SurahCard from '../components/SurahCard';
import { MdMenu } from 'react-icons/md';

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Descriptions françaises complètes des sourates
  const frenchDescriptions = {
    1: "Al-Fatiha (L'Ouverture) - La première sourate du Coran, considérée comme la clé du Livre",
    2: "Al-Baqara (La Vache) - La plus longue sourate, traitant de nombreux aspects de la foi et de la loi",
    3: "Al-Imran (La Famille d'Imran) - Sourate sur la famille de Marie et Jésus",
    4: "An-Nisa (Les Femmes) - Traite des droits des femmes et des relations familiales",
    5: "Al-Ma'ida (La Table Servie) - Évoque le repas descendu du ciel pour Jésus",
    6: "Al-An'am (Les Bestiaux) - Parle de la création et des animaux",
    7: "Al-A'raf (Les Murailles) - Histoire des prophètes et du Jour du Jugement",
    8: "Al-Anfal (Le Butin) - Règles de guerre et de paix",
    9: "At-Tawba (Le Repentir) - Sur le pardon et la repentance",
    10: "Yunus (Jonas) - Histoire du prophète Jonas",
    11: "Hud - Histoire du prophète Hud et d'autres prophètes",
    12: "Yusuf (Joseph) - L'histoire complète du prophète Joseph",
    13: "Ar-Ra'd (Le Tonnerre) - Sur les signes de la nature",
    14: "Ibrahim (Abraham) - Histoire du prophète Abraham",
    15: "Al-Hijr - Histoire des peuples anciens",
    16: "An-Nahl (Les Abeilles) - Sur les bienfaits de Dieu dans la nature",
    17: "Al-Isra (Le Voyage Nocturne) - Le voyage nocturne du Prophète",
    18: "Al-Kahf (La Caverne) - Histoire des gens de la caverne",
    19: "Maryam (Marie) - Histoire de Marie et de Jésus",
    20: "Ta-Ha - Histoire de Moïse et autres récits",
    21: "Al-Anbiya (Les Prophètes) - Histoires de différents prophètes",
    22: "Al-Hajj (Le Pèlerinage) - Sur les rites du pèlerinage",
    23: "Al-Mu'minun (Les Croyants) - Qualités des vrais croyants",
    24: "An-Nur (La Lumière) - Règles de moralité et de comportement",
    25: "Al-Furqan (Le Discernement) - Distinction entre le vrai et le faux",
    26: "Ash-Shu'ara (Les Poètes) - Histoires des prophètes précédents",
    27: "An-Naml (Les Fourmis) - Histoire de Salomon et de la reine de Saba",
    28: "Al-Qasas (Le Récit) - Histoire détaillée de Moïse",
    29: "Al-Ankabut (L'Araignée) - Tests de la foi",
    30: "Ar-Rum (Les Romains) - Prophétie sur la victoire des Romains",
    31: "Luqman - Sagesse et conseils de Luqman",
    32: "As-Sajda (La Prosternation) - Sur l'importance de la prière",
    33: "Al-Ahzab (Les Coalisés) - Sur la bataille des coalisés",
    34: "Saba - Histoire du peuple de Saba",
    35: "Fatir (Le Créateur) - Sur la création divine",
    36: "Ya-Sin - Cœur du Coran, sur la résurrection",
    37: "As-Saffat (Les Rangés) - Sur les anges et les prophètes",
    38: "Sad - Histoire de David et autres prophètes",
    39: "Az-Zumar (Les Groupes) - Sur le Jour du Jugement",
    40: "Ghafir (Le Pardonneur) - Sur le pardon divin",
    41: "Fussilat (Les Versets Détaillés) - Explications détaillées du Coran",
    42: "Ash-Shura (La Consultation) - Sur la gouvernance et la consultation",
    43: "Az-Zukhruf (L'Ornement) - Sur les richesses matérielles",
    44: "Ad-Dukhan (La Fumée) - Signes du Jour du Jugement",
    45: "Al-Jathiya (L'Agenouillée) - Sur le Jour du Jugement",
    46: "Al-Ahqaf - Histoire du peuple de 'Ad",
    47: "Muhammad - Sur le Prophète Muhammad et ses enseignements",
    48: "Al-Fath (La Victoire) - Sur la conquête de La Mecque",
    49: "Al-Hujurat (Les Appartements) - Éthique sociale",
    50: "Qaf - Sur la résurrection et la création",
    51: "Adh-Dhariyat (Les Vents) - Sur les signes de la création",
    52: "At-Tur (Le Mont) - Serment par le mont Sinaï",
    53: "An-Najm (L'Étoile) - Sur la révélation divine",
    54: "Al-Qamar (La Lune) - Sur le Jour du Jugement",
    55: "Ar-Rahman (Le Tout Miséricordieux) - Sur les bienfaits de Dieu",
    56: "Al-Waqi'a (L'Événement) - Sur le Jour du Jugement",
    57: "Al-Hadid (Le Fer) - Sur les bienfaits du fer",
    58: "Al-Mujadila (La Discussion) - Sur le dialogue",
    59: "Al-Hashr (L'Exode) - Sur l'expulsion des ennemis",
    60: "Al-Mumtahana (L'Éprouvée) - Sur les relations avec les non-croyants",
    61: "As-Saff (Le Rang) - Sur l'unité des croyants",
    62: "Al-Jumu'a (Le Vendredi) - Sur la prière du vendredi",
    63: "Al-Munafiqun (Les Hypocrites) - Sur l'hypocrisie",
    64: "At-Taghabun (La Grande Perte) - Sur le Jour du Jugement",
    65: "At-Talaq (Le Divorce) - Règles du divorce",
    66: "At-Tahrim (L'Interdiction) - Sur la vie familiale",
    67: "Al-Mulk (La Royauté) - Sur la souveraineté de Dieu",
    68: "Al-Qalam (La Plume) - Sur l'écriture et la sagesse",
    69: "Al-Haqqah (L'Inévitable) - Sur le Jour du Jugement",
    70: "Al-Ma'arij (Les Voies d'Ascension) - Sur la patience",
    71: "Nuh (Noé) - Histoire du prophète Noé",
    72: "Al-Jinn (Les Djinns) - Sur le monde des djinns",
    73: "Al-Muzzammil (L'Enveloppé) - Instructions au Prophète",
    74: "Al-Muddaththir (Le Revêtu) - Début de la mission prophétique",
    75: "Al-Qiyamah (La Résurrection) - Sur le Jour de la Résurrection",
    76: "Al-Insan (L'Homme) - Sur la création de l'homme",
    77: "Al-Mursalat (Les Envoyés) - Sur les vents et le Jugement",
    78: "An-Naba (La Nouvelle) - Sur le Jour du Jugement",
    79: "An-Nazi'at (Les Anges Arracheurs) - Sur la résurrection",
    80: "Abasa (Il s'est Renfrogné) - Sur l'égalité des hommes",
    81: "At-Takwir (L'Obscurcissement) - Signes de la fin des temps",
    82: "Al-Infitar (La Rupture) - Sur le Jour du Jugement",
    83: "Al-Mutaffifin (Les Fraudeurs) - Sur l'honnêteté",
    84: "Al-Inshiqaq (La Déchirure) - Sur la fin du monde",
    85: "Al-Buruj (Les Constellations) - Sur la persécution des croyants",
    86: "At-Tariq (L'Astre Nocturne) - Sur la création",
    87: "Al-A'la (Le Très-Haut) - Sur la grandeur de Dieu",
    88: "Al-Ghashiyah (L'Enveloppante) - Sur le Jour du Jugement",
    89: "Al-Fajr (L'Aube) - Sur les peuples anciens",
    90: "Al-Balad (La Cité) - Sur les épreuves de la vie",
    91: "Ash-Shams (Le Soleil) - Sur l'âme humaine",
    92: "Al-Layl (La Nuit) - Sur la charité",
    93: "Ad-Duha (Le Jour Montant) - Réconfort au Prophète",
    94: "Ash-Sharh (L'Ouverture) - Sur le soulagement après la difficulté",
    95: "At-Tin (Le Figuier) - Sur la création de l'homme",
    96: "Al-Alaq (L'Adhérence) - Première révélation du Coran",
    97: "Al-Qadr (La Destinée) - Sur la nuit du destin",
    98: "Al-Bayyinah (La Preuve) - Sur la foi pure",
    99: "Az-Zalzalah (La Secousse) - Sur le Jour du Jugement",
    100: "Al-Adiyat (Les Coursiers) - Sur le Jour du Jugement",
    101: "Al-Qari'ah (Le Fracas) - Sur le Jour du Jugement",
    102: "At-Takathur (La Course aux Richesses) - Sur la vie mondaine",
    103: "Al-Asr (Le Temps) - Sur l'importance du temps",
    104: "Al-Humazah (Les Calomniateurs) - Sur la médisance",
    105: "Al-Fil (L'Éléphant) - Histoire de l'armée de l'éléphant",
    106: "Quraysh - Sur la tribu de Quraysh",
    107: "Al-Ma'un (L'Ustensile) - Sur la charité et la prière",
    108: "Al-Kawthar (L'Abondance) - Sur les bienfaits accordés au Prophète",
    109: "Al-Kafirun (Les Infidèles) - Sur la tolérance religieuse",
    110: "An-Nasr (Le Secours) - Sur la victoire de l'Islam",
    111: "Al-Masad (Les Fibres) - Sur les opposants à l'Islam",
    112: "Al-Ikhlas (Le Monothéisme Pur) - Sur l'unicité de Dieu",
    113: "Al-Falaq (L'Aube Naissante) - Protection contre le mal",
    114: "An-Nas (Les Hommes) - Protection contre les mauvaises suggestions"
  };

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        const surahsWithFrenchDesc = response.data.data.map(surah => ({
          ...surah,
          frenchDescription: frenchDescriptions[surah.number] || surah.englishNameTranslation
        }));
        setSurahs(surahsWithFrenchDesc);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des sourates:', error);
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.frenchDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-primary-500 text-xl">Chargement des sourates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Les Sourates du Saint Coran
      </h1>

      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <MdMenu className="text-2xl" />
          <span>Retour aux horaires de prières</span>
        </Link>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Rechercher une sourate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-12 py-3 bg-[#1a1a1a] text-white rounded-lg
                   border border-gray-700 focus:outline-none focus:border-green-500"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <Link 
            to={`/quran/${surah.number}`} 
            key={surah.number}
          >
            <div
              className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] 
                       transition-all duration-300 cursor-pointer border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-500 font-medium">{surah.number}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{surah.name}</h2>
                    <span className="text-gray-400 text-sm">{surah.englishName}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {surah.frenchDescription}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          Aucune sourate trouvée pour "{searchTerm}"
        </div>
      )}

      <style jsx global>{`
        body {
          background-color: #000000;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 