import { BrowserRouter, Routes, Route } from 'react-router-dom';
import System from './pages/System';
import Blog from './pages/Blog';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<System />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
