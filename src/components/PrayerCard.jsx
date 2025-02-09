export default function PrayerCard({ title, time }) {
  return (
    <div className="bg-primary-500 bg-opacity-5 backdrop-blur-sm p-6 rounded-2xl
                    shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30
                    transition-all duration-300">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-2xl text-primary-500">{time}</p>
    </div>
  );
} 