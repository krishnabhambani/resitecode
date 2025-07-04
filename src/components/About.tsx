
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';

const About = () => {
  const values = [
    {
      icon: '💡',
      title: 'Innovation First',
      description: 'We embrace the latest tech and cutting-edge solutions.',
    },
    {
      icon: '🎯',
      title: 'Client-Centric',
      description: 'Your goals drive our development process.',
    },
    {
      icon: '⚡',
      title: 'Quality Code',
      description: 'We adhere to best coding practices and standards.',
    },
    {
      icon: '🚀',
      title: 'Fast Delivery',
      description: 'Timely results without compromising on quality.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              About CodeResite
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We are a team of passionate developers, designers, and innovators committed to creating 
              exceptional experiences and digital solutions. Our mission is to drive innovation forward 
              using cutting-edge technologies and creative problem-solving. We empower users with practical 
              tools that simplify complex tasks — from intelligent automation and AI-powered platforms to 
              educational utilities and scalable services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/30 border-white/10 hover:border-green-400/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{value.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                      <p className="text-gray-400 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Model - Bigger and optimized */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-full h-[500px] md:h-[600px] relative overflow-hidden group">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
                fill="white"
              />
              
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full scale-110 md:scale-125"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
