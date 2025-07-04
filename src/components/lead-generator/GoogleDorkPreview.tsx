
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleDorkPreviewProps {
  dorkPreview: string;
  onClose: () => void;
}

const GoogleDorkPreview: React.FC<GoogleDorkPreviewProps> = ({ dorkPreview, onClose }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const lines = dorkPreview.split('\n');
    const queryLine = lines.find(line => line.includes('site:'));
    if (queryLine) {
      navigator.clipboard.writeText(queryLine.trim());
      toast({
        title: "Query Copied!",
        description: "Google Dork query has been copied to your clipboard.",
      });
    }
  };

  const openInGoogle = () => {
    const lines = dorkPreview.split('\n');
    const queryLine = lines.find(line => line.includes('site:'));
    if (queryLine) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryLine.trim())}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="bg-black/90 border-white/30 backdrop-blur-sm w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-green-400" />
              Generated Google Dork Query
            </div>
            <Button onClick={onClose} className="bg-white hover:bg-gray-100 text-black">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-white/20 overflow-auto max-h-96">
            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
              {dorkPreview}
            </pre>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={copyToClipboard}
              className="bg-white hover:bg-gray-100 text-black"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Query
            </Button>
            <Button
              onClick={openInGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test in Google
            </Button>
          </div>
          
          <div className="text-center text-gray-300 text-sm">
            <p>This query will be used automatically when you click "Generate Smart Leads"</p>
            <p className="mt-1">The system will crawl pages 1-5 of Google search results for comprehensive lead data</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoogleDorkPreview;
