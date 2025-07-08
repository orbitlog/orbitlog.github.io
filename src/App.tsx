import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SolarSystem from '@/pages/SolarSystem';
import System from './pages/System';
// import Blog from '@/pages/Blog';
// import Projects from '@/pages/Projects';
// import About from '@/pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<System />} />
        {/* <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
