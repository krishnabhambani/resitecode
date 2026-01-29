
import React from 'react';
import Layout from '@/components/Layout';
import { ResumeBuilderApp } from '@/components/resume-builder/ResumeBuilderApp';

const ResumeBuilder = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 animated-gradient">
              AI Resume Builder
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create ATS-optimized resumes tailored to specific job descriptions using AI
            </p>
          </div>
          <ResumeBuilderApp />
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
