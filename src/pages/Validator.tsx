
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import * as XLSX from 'xlsx';

interface CertificateData {
  certificateId: string;
  email: string;
  holderName: string;
  issuanceDate: string;
  issuer: string;
  certificateType: string;
  status: string;
}

const Validator = () => {
  const [formData, setFormData] = useState({
    certificateId: '',
    email: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CertificateData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [certificatesData, setCertificatesData] = useState<CertificateData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load the Excel file when component mounts
    loadCertificatesData();
  }, []);

  const loadCertificatesData = async () => {
    try {
      const response = await fetch('/certifi cr.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Assuming the data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Raw Excel data:', jsonData);
      console.log('First row keys:', jsonData.length > 0 ? Object.keys(jsonData[0]) : 'No data');
      
      // Map the data to our expected format with multiple possible column name variations
      const certificates: CertificateData[] = jsonData.map((row: any) => {
        // Clean and normalize the data
        const cleanString = (str: any) => {
          if (!str) return '';
          return String(str).trim().replace(/\s+/g, ' ');
        };

        const cert = {
          certificateId: cleanString(row['Certificate ID'] || row['CertificateID'] || row['certificateId'] || row['ID'] || row['Certificate_ID']),
          email: cleanString(row['Email'] || row['EMAIL'] || row['email'] || row['Email Address'] || row['Email_Address']),
          holderName: cleanString(row['Holder Name'] || row['HolderName'] || row['holderName'] || row['Name'] || row['Student Name'] || row['Student_Name']),
          issuanceDate: 'July 2025', // Default issue date for all certificates
          issuer: cleanString(row['Issuer'] || row['issuer'] || row['Issued By'] || row['Issued_By'] || row['Organization']) || 'CodeResite',
          certificateType: 'Intern', // Default certificate type for all certificates
          status: cleanString(row['Status'] || row['status']) || 'Valid'
        };
        
        console.log('Mapped certificate:', cert);
        return cert;
      });
      
      setCertificatesData(certificates);
      console.log('Final certificates data:', certificates);
      console.log('Total certificates loaded:', certificates.length);
      
      // Log available columns for debugging
      if (jsonData.length > 0) {
        console.log('Available columns in Excel:', Object.keys(jsonData[0]));
      }
      
    } catch (error) {
      console.error('Error loading certificates data:', error);
      toast({
        title: "Error loading certificates",
        description: "Could not load the certificates database. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);
    setHasSubmitted(true);

    try {
      const searchCertId = formData.certificateId.trim().toLowerCase();
      const searchEmail = formData.email.trim().toLowerCase();
      
      console.log('Searching for:', { 
        certificateId: searchCertId, 
        email: searchEmail,
        totalCertificates: certificatesData.length
      });
      
      // Debug: Log all certificate IDs and emails for comparison
      console.log('All certificates in database:');
      certificatesData.forEach((cert, index) => {
        console.log(`${index + 1}. ID: "${cert.certificateId.toLowerCase()}" | Email: "${cert.email.toLowerCase()}"`);
      });
      
      // Find matching certificate
      const matchingCertificate = certificatesData.find(cert => {
        const certId = cert.certificateId.toLowerCase().trim();
        const certEmail = cert.email.toLowerCase().trim();
        
        const certIdMatch = certId === searchCertId;
        const emailMatch = certEmail === searchEmail;
        
        console.log('Checking certificate:', {
          originalCertId: cert.certificateId,
          normalizedCertId: certId,
          searchCertId: searchCertId,
          certIdMatch,
          originalEmail: cert.email,
          normalizedEmail: certEmail,
          searchEmail: searchEmail,
          emailMatch,
          bothMatch: certIdMatch && emailMatch
        });
        
        return certIdMatch && emailMatch;
      });

      console.log('Matching certificate found:', matchingCertificate);

      if (matchingCertificate) {
        setVerificationResult(matchingCertificate);
        toast({
          title: "Certificate Verified Successfully!",
          description: "The certificate is valid and matches our records.",
        });
      } else {
        setVerificationResult(null);
        toast({
          title: "Certificate Not Found",
          description: "No matching certificate found for the provided ID and email combination.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Certificate Validator
            </h1>
            <p className="text-gray-300">
              Verify the authenticity of CodeResite certificates
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-black/40 border-white/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="certificateId" className="text-white">
                      Certificate ID *
                    </Label>
                    <Input
                      id="certificateId"
                      name="certificateId"
                      value={formData.certificateId}
                      onChange={handleInputChange}
                      placeholder="Enter certificate ID"
                      required
                      className="mt-1 bg-black/50 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="mt-1 bg-black/50 border-white/30 text-white placeholder-gray-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isVerifying}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-3 rounded-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                  </Button>
                </form>

                {hasSubmitted && verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-green-500/20 border border-green-400/30 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        Certificate Verified
                      </h3>
                      
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Holder:</span>
                          <span className="text-white font-medium">{verificationResult.holderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Type:</span>
                          <span className="text-white font-medium">{verificationResult.certificateType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Issued Date:</span>
                          <span className="text-white font-medium">{verificationResult.issuanceDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Issuer:</span>
                          <span className="text-white font-medium">{verificationResult.issuer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Status:</span>
                          <span className="text-green-400 font-bold">{verificationResult.status}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {hasSubmitted && !verificationResult && !isVerifying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-red-500/20 border border-red-400/30 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">❌</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Certificate Not Found
                      </h3>
                      <p className="text-gray-300 text-sm">
                        No matching certificate found for the provided credentials.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white text-white bg-black hover:bg-white hover:text-black"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Validator;
