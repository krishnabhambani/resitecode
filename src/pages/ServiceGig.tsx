
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const ServiceGig = () => {
  const { service } = useParams();
  const navigate = useNavigate();

  const serviceData: { [key: string]: any } = {
    'ai-solutions': {
      title: 'AI Solutions',
      description: 'Transform your business with custom AI implementations',
      icon: '🤖',
      projects: [
        {
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
          title: 'Intelligent Chatbot System',
          description: 'Custom chatbot with natural language processing capabilities',
          cta: 'Learn More'
        },
        {
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
          title: 'Predictive Analytics Platform',
          description: 'Machine learning models for business intelligence',
          cta: 'Get Started'
        },
        {
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          title: 'Process Automation Suite',
          description: 'Automate repetitive tasks with AI-powered workflows',
          cta: 'View Demo'
        }
      ]
    },
    'web-services': {
      title: 'Web Services',
      description: 'Modern, responsive web applications built for performance',
      icon: '🌐',
      projects: [
        {
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
          title: 'E-commerce Platform',
          description: 'Full-featured online store with payment integration',
          cta: 'View Portfolio'
        },
        {
          image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
          title: 'Corporate Website',
          description: 'Professional business website with CMS',
          cta: 'See Examples'
        },
        {
          image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
          title: 'Web Application',
          description: 'Custom web app with advanced functionality',
          cta: 'Get Quote'
        }
      ]
    },
    'app-development': {
      title: 'App Development',
      description: 'Native and cross-platform mobile applications',
      icon: '📱',
      projects: [
        {
          image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
          title: 'iOS Mobile App',
          description: 'Native iOS application with sleek design',
          cta: 'View App'
        },
        {
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
          title: 'Android Application',
          description: 'Feature-rich Android app with modern UI',
          cta: 'Download'
        },
        {
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
          title: 'Cross-Platform App',
          description: 'Flutter app working on both iOS and Android',
          cta: 'Try Now'
        }
      ]
    },
    'cybersecurity': {
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions and consulting',
      icon: '🔒',
      projects: [
        {
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
          title: 'Security Audit Report',
          description: 'Complete security assessment and recommendations',
          cta: 'Get Audit'
        },
        {
          image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
          title: 'Penetration Testing',
          description: 'Comprehensive pen-testing services',
          cta: 'Book Test'
        },
        {
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
          title: 'Security Training',
          description: 'Employee security awareness training',
          cta: 'Learn More'
        }
      ]
    }
  };

  const currentService = serviceData[service || ''];

  if (!currentService) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600 text-black">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="text-8xl mb-6">{currentService.icon}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              {currentService.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {currentService.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentService.projects.map((project: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-300 text-sm mb-6">{project.description}</p>
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-black font-medium w-full rounded-full hover:scale-105 transition-all duration-200"
                    >
                      {project.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white text-black bg-white hover:bg-gray-100 hover:text-black mr-4 hover:scale-105 transition-all duration-200"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-green-500 hover:bg-green-600 text-black font-medium hover:scale-105 transition-all duration-200"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceGig;
