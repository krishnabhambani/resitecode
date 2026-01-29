
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const greetings = [
  'Hello',      // English
  'Hola',       // Spanish
  'Bonjour',    // French
  'नमस्ते',      // Hindi
  'こんにちは',    // Japanese
  'Hallo'       // German
];

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
    }, 150); // Change text every 150ms for fast cycling

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 1100); // Show for 1.1 seconds total

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
        {greetings[currentIndex]}
      </h1>
    </motion.div>
  );
};

export default SplashScreen;
