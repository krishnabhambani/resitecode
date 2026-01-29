
import React from 'react';
import Layout from '@/components/Layout';
import { WebsiteBuilderApp } from '@/components/website-builder/WebsiteBuilderApp';

const WebsiteBuilder = () => {
  return (
    <Layout>
      <div className="pt-16">
        <WebsiteBuilderApp />
      </div>
    </Layout>
  );
};

export default WebsiteBuilder;
