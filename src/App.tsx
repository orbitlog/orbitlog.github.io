import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useLayoutEffect } from 'react';
import CloudCurtain from './components/CloudCurtain';
import System from './pages/System';

const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const PlanetModule = lazy(() => import('./pages/PlanetModule'));
const Projects = lazy(() => import('./pages/Projects'));
const Sun = lazy(() => import('./pages/Sun'));
const Mercury = lazy(() => import('./pages/Mercury'));
const MercuryArticle = lazy(() => import('./pages/MercuryArticle'));

function ArrivalAtmosphere() {
  const location = useLocation();
  return location.state?.fromAtmosphere ? (
    <CloudCurtain key={location.key} className="route-cloud route-cloud--lifting" />
  ) : null;
}

function RouteScrollReset() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteScrollReset />
      <ArrivalAtmosphere />
      <Suspense fallback={<main className="route-loading" role="status">正在展开轨道日志…</main>}>
        <Routes>
          <Route path="/" element={<System />} />
          <Route path="/module/mars" element={<Projects />} />
          <Route path="/module/sun" element={<Sun />} />
          <Route path="/module/mercury" element={<Mercury />} />
          <Route path="/module/mercury/:slug" element={<MercuryArticle />} />
          <Route path="/module/:planetId" element={<PlanetModule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
