
import React from 'react';
import { SparklesCore } from './ui/sparkles';
import Navbar from './Navbar';
import Footer from './Footer';
import MetaHead from './MetaHead';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <MetaHead />
      <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
        {/* Full-screen sparkles background */}
        <div className="fixed inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#00ff00"
            speed={0.5}
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
