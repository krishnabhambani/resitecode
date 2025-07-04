
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'AI Solutions',
      description: 'Custom chatbots, personalized agents, intelligent automation, and machine learning implementations.',
      icon: '🤖',
      features: ['Custom AI Models', 'Chatbot Development', 'Process Automation', 'ML Integration'],
      slug: 'ai-solutions',
    },
    {
      title: 'Web Services',
      description: 'Dynamic, responsive websites and web applications built with modern technologies.',
      icon: '🌐',
      features: ['Responsive Design', 'Full-Stack Development', 'E-commerce Solutions', 'Performance Optimization'],
      slug: 'web-services',
    },
    {
      title: 'App Development',
      description: 'Native iOS/Android applications and cross-platform mobile solutions.',
      icon: '📱',
      features: ['iOS Development', 'Android Development', 'Cross-Platform Apps', 'App Store Deployment'],
      slug: 'app-development',
    },
    {
      title: 'Cybersecurity',
      description: 'Security audits, penetration testing, vulnerability assessments, and asset protection.',
      icon: '🔒',
      features: ['Security Audits', 'Penetration Testing', 'Vulnerability Assessment', 'Security Consulting'],
      slug: 'cybersecurity',
    },
  ];

  const handleViewMore = (slug: string) => {
    navigate(`/services/${slug}`);
  };

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="h-full"
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="text-5xl mb-4 text-center">{service.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{service.title}</h3>
                  <p className="text-gray-300 text-sm mb-6 flex-grow">{service.description}</p>
                  
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-400 flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => handleViewMore(service.slug)}
                    className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full w-full hover:scale-105 transition-all duration-200"
                  >
                    View More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
