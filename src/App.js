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
import { Web } from './components/pages/Web';
import { AppComponent } from './components/pages/App';
import { Blog, Android } from './components/pages/Android';
import { Resume } from './components/pages/Resume';
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
        <Route path="/web" exact component={Web} />
        <Route path="/app" exact component={AppComponent} />
        <Route path="/android" exact component={Android} />
        <Route path="/resume" exact component={Resume} />
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