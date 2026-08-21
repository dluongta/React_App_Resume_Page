import React, { useEffect, useRef } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

import { Header } from './components/homes/header/Header';
import { HomePage } from './components/homes/HomePage';
import { Footer } from './components/homes/footer/Footer';
import { Web } from './components/pages/Web';
import { AppComponent } from './components/pages/App';
import { Android } from './components/pages/Android';
import { Resume } from './components/pages/Resume';
import ScrollToTopButton from './components/homes/ScrollToTopButton';
import CustomScrollbar from './components/homes/CustomScrollbar';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    const isSubPage =
      location.pathname.startsWith('/web') ||
      location.pathname.startsWith('/android') ||
      location.pathname.startsWith('/app');

    if (root) {
      root.classList.toggle('sub-root', isSubPage);
    }
    document.body.classList.toggle('sub-root', isSubPage);

    return () => {
      if (root) {
        root.classList.remove('sub-root');
      }
      document.body.classList.remove('sub-root');
    };
  }, [location.pathname]);

  return (
    <>
      <CustomScrollbar />
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

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;