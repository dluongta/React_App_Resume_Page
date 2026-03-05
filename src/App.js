import React from 'react';
import './App.css';
import { Header } from './components/home/header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import { HomePage } from './components/pageComponent/HomePage';
import { Footer } from './components/home/Footer';
import { Pages } from './components/pages/Pages';
import { Portfolio } from './components/pages/Portfolio';
import { Blog } from './components/pages/Blog';
import { Contact } from './components/pages/Contact';
import { Galaxy } from './components/pages/Galaxy';
import ScrollToTopButton from './components/button/ScrollToTopButton';
import { FireworkButton } from './components/pageComponent/FireworkButton';
import { FireworksEffect } from './components/pageComponent/FireworksEffect';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import hexagon from '../src/assets/hexagon.png';

const particlesOptions = {
  fullScreen: {
    enable: true,
    zIndex: 1000,
  },
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      push: { quantity: 10 },
      repulse: { distance: 100 },
    },
  },
  particles: {
    number: { value: 50 },
    size: { value: 12 },
    shape: {
      type: 'image',
      image: [{ src: hexagon, width: 20, height: 20 }],
    },
    move: {
      enable: true,
      speed: 8,
      direction: 'bottom',
      random: true,
      straight: false,
    },
    opacity: { value: 0.8 },
  },
};

const particlesInit = (engine) => {
  loadSlim(engine);
};

const AppContent = () => {
  const location = useLocation();
  
  const isGalaxyPage = location.pathname === '/galaxy';

  return (
    <>
      {!isGalaxyPage && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
          }}
        />
      )}

      <Header />

      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/pages' exact component={Pages} />
        <Route path='/portfolio' exact component={Portfolio} />
        <Route path='/blog' exact component={Blog} />
        <Route path='/contact' exact component={Contact} />
        <Route path='/galaxy' exact component={Galaxy} />
      </Switch>

      <Footer />

      {!isGalaxyPage && (
        <>
          <FireworksEffect />
          <FireworkButton />
        </>
      )}

      <ScrollToTopButton />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;