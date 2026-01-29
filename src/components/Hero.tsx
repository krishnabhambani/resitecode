import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import DisplayCards from './ui/display-cards';
import { FileText, Image, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = ['AI Solutions', 'Web Services', 'App Development', 'Cybersecurity'];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryFreeTools = () => {
    navigate('/resume-builder');
  };

  const displayCardsData = [
    {
      icon: <FileText className="size-4 text-green-300" />,
      title: "PPT Generator",
      description: "Create presentations instantly",
      date: "AI-Powered",
      iconClassName: "text-green-500",
      titleClassName: "text-green-500",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="size-4 text-blue-300" />,
      title: "Report Generator",
      description: "Comprehensive reports in seconds",
      date: "Smart AI",
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      className: "[grid-area:stack] translate-x-8 md:translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Image className="size-4 text-purple-300" />,
      title: "AI Image Creator",
      description: "Professional visuals made easy",
      date: "Creative AI",
      iconClassName: "text-purple-500",
      titleClassName: "text-purple-500",
      className: "[grid-area:stack] translate-x-16 md:translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-4 pt-16">
      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          We Drive Innovation Forward
        </h1>
        
        {/* Animated Subtext */}
        <div className="text-xl md:text-2xl lg:text-3xl text-green-400 font-medium h-12 flex items-center justify-center">
          <motion.span
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {texts[currentText]}
          </motion.span>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <Button 
          onClick={handleTryFreeTools}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg hover:scale-105 transition-all duration-200"
        >
          Try Free Tools
        </Button>
        <Button 
          onClick={() => scrollToSection('services')}
          variant="outline"
          size="lg"
          className="border-white text-black bg-white hover:bg-gray-100 hover:text-black px-8 py-3 rounded-full text-lg hover:scale-105 transition-all duration-200"
        >
          Explore Services
        </Button>
      </motion.div>

      {/* Display Cards - Better mobile responsiveness */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-5xl px-4"
      >
        {/* Responsive wrapper */}
        <div className="flex flex-wrap justify-center gap-6">
          <DisplayCards cards={displayCardsData} />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
