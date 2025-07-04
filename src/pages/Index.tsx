
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedTools from '@/components/FeaturedTools';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      
      {!showSplash && (
        <Layout>
          <Hero />
          <About />
          <FeaturedTools />
          <Services />
          <Pricing />
          <Contact />
        </Layout>
      )}
    </>
  );
};

export default Index;
