import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useLayoutEffect } from 'react';
import CloudCurtain from './components/CloudCurtain';
import System from './pages/System';
import Blog from './pages/Blog';
import About from './pages/About';
import PlanetModule from './pages/PlanetModule';
import Projects from './pages/Projects';
import Sun from './pages/Sun';
import Mercury, { MercuryShell } from './pages/Mercury';

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
      <Routes>
        <Route path="/" element={<System />} />
        <Route path="/module/mars" element={<Projects />} />
        <Route path="/module/sun" element={<Sun />} />
        <Route path="/module/mercury" element={<Mercury />} />
        <Route path="/module/mercury/:slug" element={<Suspense fallback={<MercuryShell article><p className="mercury-loading mercury-inner" role="status">正在展开轨道日志…</p></MercuryShell>}><MercuryArticle /></Suspense>} />
        <Route path="/module/:planetId" element={<PlanetModule />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
