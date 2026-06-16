import React, { useEffect } from 'react';
import './App.css';

import { Header } from './components/home/header/Header';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

import { HomePage } from './components/pageComponent/HomePage';
import { Footer } from './components/home/Footer';
import { Pages } from './components/pages/Pages';
import { Portfolio } from './components/pages/Portfolio';
import { Blog } from './components/pages/Blog';
import { Contact } from './components/pages/Contact';
import ScrollToTopButton from './components/button/ScrollToTopButton';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
  const root = document.getElementById('root');

  const enableRootStyle =
    location.pathname.startsWith('/web') ||
    location.pathname.startsWith('/mobile') ||
    location.pathname.startsWith('/app');

  if (enableRootStyle) {
    root.classList.add('sub-root');
    document.body.classList.add('sub-root');
  } else {
    root.classList.remove('sub-root');
    document.body.classList.remove('sub-root');
  }

  return () => {
    root.classList.remove('sub-root');
    document.body.classList.remove('sub-root');
  };
}, [location.pathname]);

  return (
    <>
      <Header />

      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/web" exact component={Pages} />
        <Route path="/app" exact component={Portfolio} />
        <Route path="/mobile" exact component={Blog} />
        <Route path="/portfolio" exact component={Contact} />
      </Switch>

      <Footer />

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