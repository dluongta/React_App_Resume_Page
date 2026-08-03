import React, { useEffect } from 'react';
import { About } from '../homes/About';
import { Branding } from '../homes/Branding';
import { Home } from '../homes/Home';
import { Skill } from '../homes/Skill';
import { WrapperOne } from '../homes/WrapperOne';
import { Service } from '../homes/Service';
import { Wrapper } from '../homes/Wrapper';
import { Link } from 'react-router-dom';
import hexagon from '../../assets/hexagon.png';
import SplitFlapLog from './SplitFlapLog';
import { CounterSection } from './CounterSection';

export const HomePage = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const handleScroll = () => {
      revealElements.forEach((element) => {
        const { top } = element.getBoundingClientRect();
        if (top < window.innerHeight - 100) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Home className="reveal" />
      <Branding className="reveal" />
      <About className="reveal" />
      <Wrapper className="reveal" />
      <Skill className="reveal" />
      <Service className="reveal" />
      <CounterSection className="reveal" />
      <WrapperOne className="reveal" />
      <SplitFlapLog className="reveal" />
    </>
  );
};
