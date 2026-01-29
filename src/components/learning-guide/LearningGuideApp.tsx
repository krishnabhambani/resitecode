
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, ArrowLeft, X } from 'lucide-react';

const roleBased = [
  "Frontend", "Backend", "DevOps", "Full Stack", "AI Engineer", "Data Scientist", 
  "Android", "iOS", "PostgreSQL DBA", "Blockchain", "QA", "Software Architect", 
  "Cyber Security", "UX Design", "Game Developer", "Technical Writer", 
  "MLOps", "Product Manager", "Engineering Manager", "Developer Relations"
];

const skillBased = [
  "SQL", "Computer Science", "React", "Vue", "Angular", "JavaScript", 
  "NodeJS", "TypeScript", "Python", "System Design", "API Design", "ASP.NET Core", 
  "Java", "C++", "Flutter", "Springboot", "Golang", "Rust", "GraphQL", 
  "Design and Architecture", "Design System", "React Native", "AWS", 
  "Code Review", "Docker", "Kubernetes", "Linux", "MongoDB", "Prompt Engineering", 
  "Terraform", "Data Structures and Algorithms", "Git", "GitHub", "Redis", 
  "PHP", "Cloudflare", "AI Agents", "AI"
];

export function LearningGuideApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const getImagePath = (title: string) => {
    const fileName = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, '')
      .replace(/\./g, '')
      .replace(/\+/g, 'plus');
    return `/roadmaps/${fileName}.png`;
  };

  const handleDownload = (title: string) => {
    const link = document.createElement('a');
    link.href = getImagePath(title);
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-roadmap.png`;
    link.click();
  };

  const handleRoadmapClick = (title: string) => {
    setSelectedRoadmap(title);
  };

  const handleBackToHome = () => {
    setSelectedRoadmap(null);
    setSearchTerm('');
  };

  const filteredRoleRoadmaps = useMemo(() => {
    return roleBased.filter(role =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredSkillRoadmaps = useMemo(() => {
    return skillBased.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFiltered = [...filteredRoleRoadmaps, ...filteredSkillRoadmaps];
    if (allFiltered.length > 0) {
      setSelectedRoadmap(allFiltered[0]);
    }
  };

  // Image viewer component
  if (selectedRoadmap) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToHome}
                className="bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h2 className="text-2xl font-bold text-white">{selectedRoadmap} Roadmap</h2>
              <Button
                onClick={() => handleDownload(selectedRoadmap)}
                className="bg-green-500 text-black hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
            <Button
              onClick={() => setSelectedRoadmap(null)}
              className="bg-white text-black hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <img 
              src={getImagePath(selectedRoadmap)}
              alt={`${selectedRoadmap} Roadmap`}
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop`;
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Learning Guide
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover comprehensive roadmaps for various roles and skills in tech. 
          Find your path and start your learning journey today.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for roles or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-white/20 text-white placeholder-gray-400 h-12"
          />
        </form>
      </motion.div>

      {/* Role-Based Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Role-Based Roadmaps</h2>
          <p className="text-gray-400">Career-focused learning paths for specific roles</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filteredRoleRoadmaps.map((role, index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleRoadmapClick(role)}
                className="w-full h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-white hover:from-green-500/30 hover:to-blue-500/30 hover:border-green-400 transition-all duration-300 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <span className="font-medium text-center">{role}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Skill-Based Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Skill-Based Roadmaps</h2>
          <p className="text-gray-400">Technology and skill-specific learning paths</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filteredSkillRoadmaps.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleRoadmapClick(skill)}
                className="w-full h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400 transition-all duration-300 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <span className="font-medium text-center">{skill}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {(filteredRoleRoadmaps.length === 0 && filteredSkillRoadmaps.length === 0 && searchTerm) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-white/10">
            <p className="text-gray-400 text-lg mb-4">
              No roadmaps found for "{searchTerm}"
            </p>
            <p className="text-gray-500">
              Try a different search term or browse our available roadmaps above.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
