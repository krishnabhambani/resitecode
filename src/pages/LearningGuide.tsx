
import React from 'react';
import Layout from '@/components/Layout';
import { LearningGuideApp } from '@/components/learning-guide/LearningGuideApp';

const LearningGuide = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <LearningGuideApp />
      </div>
    </Layout>
  );
};

export default LearningGuide;
