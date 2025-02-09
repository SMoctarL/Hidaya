export default function CitySelector({ selectedCity, onCityChange, cities }) {
  return (
    <div className="flex justify-center">
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-auto min-w-[200px] px-6 py-3 text-white rounded-2xl 
                   bg-primary-500 bg-opacity-20 backdrop-blur-sm
                   border-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer
                   mx-auto text-center shadow-lg shadow-primary-500/20
                   hover:bg-opacity-30 transition-all duration-300
                   [&>option]:bg-gray-800 [&>option]:text-white"
      >
        {Object.entries(cities).map(([key, city]) => (
          <option 
            key={key} 
            value={key}
            className="py-2 px-4"
          >
            {city.name || key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
} 