import { Link } from 'react-router-dom';

export default function SurahCard({ surah }) {
  return (
    <Link 
      to={`/quran/${surah.number}`}
      className="block bg-primary-500 bg-opacity-5 backdrop-blur-sm p-6 rounded-2xl
                transform hover:-translate-y-1 transition-all duration-300
                shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
    >
      <h3 className="text-xl font-semibold text-primary-500 mb-2">
        {surah.number}. {surah.name} ({surah.englishName})
      </h3>
      <p className="mb-4 text-gray-300">{surah.frenchDescription}</p>
      <div className="text-sm text-primary-500">
        {surah.numberOfAyahs} versets • {surah.revelationType === 'Meccan' ? 'La Mecque' : 'Médine'}
      </div>
    </Link>
  );
} 