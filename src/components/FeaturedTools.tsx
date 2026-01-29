import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const FeaturedTools = () => {
  const navigate = useNavigate();

  const toolSections = [
    {
      id: 'marketing',
      title: '📊 Marketing',
      signatureTool: {
        title: 'Mail Merger Tool',
        description: 'Merge your mail to automate workflow with dynamic fields and personalization',
        icon: '📧',
        featured: true,
        onClick: () => navigate('/mail-merger'),
      },
      tools: [
        { 
          title: 'Lead Generation Tool', 
          description: 'Automated lead discovery', 
          icon: '🎯',
          onClick: () => navigate('/lead-generator'),
        },
        { 
          title: 'AI Website Builder', 
          description: 'Create accessible websites instantly with AI', 
          icon: '🌐',
          onClick: () => navigate('/website-builder'),
        },
        { 
          title: 'Mail Merger tool', 
          description: 'Merge your mail to automate workflow', 
          icon: '📧',
          onClick: () => navigate('/mail-merger'),
        },
        { 
          title: 'Prompt Guide', 
          description: 'AI prompting strategies', 
          icon: '💬',
          onClick: () => navigate('/prompt-guide'),
        },
      ],
    },
    {
      id: 'students',
      title: '🎓 Students',
      signatureTool: {
        title: 'Resume Builder',
        description: 'Create ATS-optimized resumes tailored to specific job descriptions using AI',
        icon: '📄',
        featured: true,
        onClick: () => navigate('/resume-builder'),
      },
      tools: [
        { 
          title: 'PPT Generator', 
          description: 'AI-powered presentation maker', 
          icon: '📊',
          onClick: () => navigate('/ppt-generator'),
        },
        { 
          title: 'Resume Builder', 
          description: 'Professional resume creation', 
          icon: '📄',
          onClick: () => navigate('/resume-builder'),
        },
        { 
          title: 'Report Generator', 
          description: 'Comprehensive report writing', 
          icon: '📋',
          onClick: () => navigate('/report-generator'),
        },
        { 
          title: 'Learning Guide', 
          description: 'Personalized study materials', 
          icon: '📚',
          onClick: () => navigate('/learning-guide'),
        },
      ],
    },
    {
      id: 'social-creators',
      title: '🎨 Social Media Creators',
      signatureTool: {
        title: 'Video Editing Tool',
        description: 'Edit stunning video clips instantly with AI-powered editing features',
        icon: '🎬',
        featured: true,
        comingSoon: true,
      },
      tools: [
        { title: 'Face & Body Clone AI', description: 'Advanced AI cloning technology', icon: '🎭', comingSoon: true },
        { title: 'Voice Clone AI', description: 'Realistic voice synthesis', icon: '🎤', comingSoon: true },
        { title: 'Short Clips AI', description: 'Automated video generation', icon: '🎬', comingSoon: true },
        { title: 'Caption Writing AI', description: 'Engaging caption creation', icon: '✍️', comingSoon: true },
      ],
    },
    {
      id: 'cybersecurity',
      title: '🔐 Cybersecurity',
      signatureTool: null,
      tools: [],
      customContent: (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="bg-black/60 border-white/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Cybersecurity Solutions</h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We offer cyber security consultancy, tailored solutions, and online training. 
                Our comprehensive approach ensures your digital assets are protected with cutting-edge 
                security measures and expert guidance.
              </p>
              <p className="text-gray-400 mb-8">
                For more information, download our brochure.
              </p>
              <Button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/cybersecurity.pdf';
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  link.click();
                }}
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full hover:scale-105 transition-all duration-200"
              >
                Download Brochure
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ),
    },
  ];

  return (
    <section id="featured-tools" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Featured Tools & Solutions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered tools designed for different use cases
          </p>
        </motion.div>

        {toolSections.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {section.title}
              </h3>
              
              {/* Custom Content for Cybersecurity */}
              {section.customContent ? (
                section.customContent
              ) : (
                <>
                  {/* Signature Tool */}
                  {section.signatureTool && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="max-w-2xl mx-auto mb-8"
                    >
                      <Card className="bg-black/60 border-white/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
                        <CardContent className="p-8 text-center">
                          <div className="text-6xl mb-4">{section.signatureTool.icon}</div>
                          <h4 className="text-2xl font-bold text-white mb-3">
                            {section.signatureTool.title}
                            <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-black rounded-full">
                              Signature Tool
                            </span>
                          </h4>
                          <p className="text-gray-300 mb-6 max-w-lg mx-auto text-lg leading-relaxed">{section.signatureTool.description}</p>
                          
                          <SignedIn>
                            <Button 
                              size="lg"
                              className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full hover:scale-105 transition-all duration-200"
                              onClick={section.signatureTool.onClick}
                              disabled={section.signatureTool.comingSoon}
                            >
                              {section.signatureTool.comingSoon ? 'Coming Soon' : 'Try Now'}
                            </Button>
                          </SignedIn>
                          
                          <SignedOut>
                            <SignInButton mode="modal">
                              <Button 
                                size="lg"
                                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full hover:scale-105 transition-all duration-200"
                              >
                                Login to Try
                              </Button>
                            </SignInButton>
                          </SignedOut>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.tools.map((tool, toolIndex) => (
                      <motion.div
                        key={toolIndex}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: toolIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card className="bg-black/70 border-white/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 h-full hover:bg-black/60">
                          <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                            <div>
                              <div className="text-4xl mb-4">{tool.icon}</div>
                              <h4 className="text-lg font-bold text-white mb-3">{tool.title}</h4>
                              <p className="text-gray-200 text-sm mb-4">{tool.description}</p>
                            </div>
                            
                            <SignedIn>
                              <Button 
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full w-full hover:scale-105 transition-all duration-200"
                                onClick={tool.onClick}
                                disabled={tool.comingSoon}
                              >
                                {tool.comingSoon ? 'Coming Soon' : 'Try It'}
                              </Button>
                            </SignedIn>
                            
                            <SignedOut>
                              <SignInButton mode="modal">
                                <Button 
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full w-full hover:scale-105 transition-all duration-200"
                                  disabled={tool.comingSoon}
                                >
                                  {tool.comingSoon ? 'Coming Soon' : 'Login to Try'}
                                </Button>
                              </SignInButton>
                            </SignedOut>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTools;
