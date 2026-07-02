import { BrowserRouter, Routes, Route } from 'react-router-dom';
import System from './pages/System';
import Blog from './pages/Blog';
import About from './pages/About';
import PlanetModule from './pages/PlanetModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<System />} />
        <Route path="/module/:planetId" element={<PlanetModule />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
