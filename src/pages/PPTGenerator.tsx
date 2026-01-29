
import React from 'react';
import Layout from '@/components/Layout';
import { AppBuilder } from '@/components/ppt-generator/AppBuilder';

const PPTGenerator = () => {
  return (
    <Layout>
      <div className="pt-16">
        <AppBuilder />
      </div>
    </Layout>
  );
};

export default PPTGenerator;
