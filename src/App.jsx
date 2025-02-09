import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetail from './pages/SurahDetail';
import Favorites from './pages/Favorites';
import InstallGuide from './pages/InstallGuide';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-[#121212]">
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/quran/:id" element={<SurahDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/install" element={<InstallGuide />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App; 