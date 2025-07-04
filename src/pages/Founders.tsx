
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Founders = () => {
  const navigate = useNavigate();

  const founders = [
    {
      name: 'Balkrishna Garg',
      role: 'Founder and CEO',
      description: 'Certified Ethical Hacker, Linux, Arch, Offensive & Defensive security',
      skills: ['Ethical Hacking', 'Linux', 'Security'],
      avatar: '/balkrishna.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/balkrishna-garg-119704294',
        email: 'balkrishnagarg@coderesite.com',
      },
    },
    {
      name: 'Sanskar Dubey',
      role: 'Founder and Director',
      description: 'MediaWiki Open source Contributor, MERN Stack developer, AI Engineer',
      skills: ['MERN Stack', 'AI', 'Open Source'],
      avatar: '/sanskar.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/sanskardev',
        email: 'sanskardubeydev@gmail.com',
      },
    },
    {
      name: 'Mohd Zaid Sayyed',
      role: 'Co-founder and Managing Director',
      description: '@GDG Prayagraj | Hackathons Winner | App Developer (Flutter/Dart)',
      skills: ['Flutter', 'Dart', 'Mobile Development'],
      avatar: '/zaid.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/zaid-sayyed',
        email: 'zaidsayyed07869@gmail.com',
      },
    },
    {
      name: 'Shiva Pandey',
      role: 'Chief Operating Officer (COO)',
      description: 'Next Js Web developer || Python (Gen AI / ML / Deep Learning) || Hackathon Winner',
      skills: ['Next.js', 'Python', 'AI/ML'],
      avatar: '/shiva.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/shiva-pandey-dev',
        email: 'shivapandey9898@gmail.com',
      },
    },
    {
      name: 'Devendra Singh',
      role: 'Chief Technology Officer',
      description: 'Full Stack Web Developer || Python & ML enthusiast || GSSoC\'24 || Building Scalable Web Project\'s',
      skills: ['Full Stack', 'Python', 'ML'],
      avatar: '/dev.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/geekydev',
        email: 'ds450974@gmail.com',
      },
    },
    {
      name: 'Adarsh Shukla',
      role: 'Chief Marketing Officer (CMO)',
      description: 'Data analytics | Data visualisation | Microsoft products propensity',
      skills: ['Data Analytics', 'Marketing', 'Microsoft'],
      avatar: '/adarsh.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/adarsh-shukla-1517b327b',
        email: 'Adarshshukla.contact@gmail.com',
      },
    },
  ];

  const scrollToSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Meet Our Founders
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The innovative minds behind CodeResite - passionate technologists driving the future of digital solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-black/80 to-black/60 border-white/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full overflow-hidden relative">
                  <CardContent className="p-0 text-center h-full flex flex-col relative">
                    {/* Blob-style image container */}
                    <div className="relative w-full h-80 overflow-hidden flex items-center justify-center p-8">
                      <div 
                        className="relative w-56 h-56 overflow-hidden border-4 border-green-400/50 group-hover:border-green-400 transition-all duration-300"
                        style={{
                          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                          animation: 'blob 8s infinite'
                        }}
                      >
                        <img 
                          src={founder.avatar} 
                          alt={founder.name}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
                        />
                        
                        {/* Hover overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center p-4"
                          style={{
                            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
                          }}
                        >
                          <h3 className="text-lg font-bold text-white mb-1">{founder.name}</h3>
                          <p className="text-green-400 font-medium mb-3 text-sm">{founder.role}</p>
                          <div className="flex justify-center space-x-4 mb-3">
                            <motion.a
                              href={founder.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white hover:text-green-400 transition-colors text-xl"
                            >
                              💼
                            </motion.a>
                            <motion.a
                              href={`mailto:${founder.social.email}`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white hover:text-green-400 transition-colors text-xl"
                            >
                              📧
                            </motion.a>
                          </div>
                          <p className="text-gray-200 text-xs text-center leading-tight">{founder.description}</p>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{founder.name}</h3>
                        <p className="text-green-400 font-medium mb-4">{founder.role}</p>
                        
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {founder.skills.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/')}
                className="bg-green-500 hover:bg-green-600 text-black font-medium mr-4 hover:scale-105 transition-all duration-200"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => scrollToSection('featured-tools')}
                variant="outline"
                className="border-white text-white bg-black hover:bg-white hover:text-black hover:scale-105 transition-all duration-200"
              >
                View All Tools
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Founders;
