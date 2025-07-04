
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Mail, Eye, Send, FileSpreadsheet, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface Contact {
  name: string;
  email: string;
  certificate?: string;
  custom_message?: string;
  [key: string]: string | undefined;
}

interface EmailResult {
  email: string;
  name: string;
  status: 'success' | 'error';
  message: string;
}

const MailMergerApp = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailTemplate, setEmailTemplate] = useState(`Dear {{name}},

I hope this email finds you well.

{{custom_message}}

{{certificate}}

Best regards,
Your Name`);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls).",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    console.log('Starting file upload process for:', file.name);

    try {
      let parsedData: any[] = [];

      if (fileExtension === 'csv') {
        // Parse CSV file
        const text = await file.text();
        console.log('CSV text preview:', text.substring(0, 200));
        
        const results = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toLowerCase()
        });

        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          throw new Error('CSV parsing failed: ' + results.errors[0].message);
        }

        parsedData = results.data;
      } else {
        // Parse Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        parsedData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: ''
        });

        // Convert headers to lowercase
        parsedData = parsedData.map(row => {
          const newRow: any = {};
          Object.keys(row).forEach(key => {
            newRow[key.trim().toLowerCase()] = row[key];
          });
          return newRow;
        });
      }

      console.log('Parsed data preview:', parsedData.slice(0, 3));

      if (parsedData.length === 0) {
        throw new Error('No data found in the file');
      }

      // Check for required columns
      const headers = Object.keys(parsedData[0]);
      console.log('Available headers:', headers);

      if (!headers.includes('name') || !headers.includes('email')) {
        toast({
          title: "Invalid File Format",
          description: "File must contain 'name' and 'email' columns.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      // Convert to contacts format
      const validContacts: Contact[] = [];
      parsedData.forEach((row, index) => {
        const name = row.name?.toString().trim();
        const email = row.email?.toString().trim();

        if (name && email) {
          const contact: Contact = { name, email };
          
          // Add all other fields
          Object.keys(row).forEach(key => {
            if (key !== 'name' && key !== 'email' && row[key]) {
              contact[key] = row[key].toString().trim();
            }
          });

          validContacts.push(contact);
        } else {
          console.log(`Skipping row ${index + 1} - missing name or email:`, row);
        }
      });

      if (validContacts.length === 0) {
        throw new Error('No valid contacts found with both name and email');
      }

      setContacts(validContacts);
      setAvailableFields(headers);
      
      console.log('Successfully loaded contacts:', validContacts.length);
      
      toast({
        title: "File Uploaded Successfully",
        description: `Loaded ${validContacts.length} contacts.`
      });

    } catch (error) {
      console.error('File parsing error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Error parsing the file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const insertField = () => {
    if (!selectedField) return;
    
    const placeholder = `{{${selectedField}}}`;
    const textarea = document.getElementById('email-template') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const textBefore = emailTemplate.substring(0, cursorPosition);
      const textAfter = emailTemplate.substring(cursorPosition);
      const newTemplate = textBefore + placeholder + textAfter;
      setEmailTemplate(newTemplate);
      
      // Reset cursor position after the inserted placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPosition + placeholder.length, cursorPosition + placeholder.length);
      }, 0);
    }
  };

  const replaceTemplate = (template: string, contact: Contact): string => {
    let result = template;
    Object.keys(contact).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = contact[key] || '';
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  };

  const sendEmails = async () => {
    if (!senderName || !senderEmail || !emailSubject) {
      toast({
        title: "Missing Information",
        description: "Please fill in sender name, email, and subject.",
        variant: "destructive"
      });
      return;
    }

    if (contacts.length === 0) {
      toast({
        title: "No Contacts",
        description: "Please upload a contact file first.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    const results: EmailResult[] = [];

    try {
      // Import the brevo service
      const { sendBulkEmails } = await import('@/lib/brevo-service');
      
      // Prepare emails data
      const emailsData = contacts.map(contact => ({
        to: { email: contact.email, name: contact.name },
        subject: emailSubject,
        htmlContent: replaceTemplate(emailTemplate, contact).replace(/\n/g, '<br>')
      }));

      const emailResults = await sendBulkEmails({
        sender: { name: senderName, email: senderEmail },
        emails: emailsData
      });

      // Process results
      emailResults.forEach((result, index) => {
        const contact = contacts[index];
        results.push({
          email: contact.email,
          name: contact.name,
          status: result.success ? 'success' : 'error',
          message: result.success ? 'Email sent successfully' : result.error || 'Failed to send email'
        });
      });

    } catch (error) {
      console.error('Bulk email sending error:', error);
      // If bulk sending fails, fall back to individual sending
      for (const contact of contacts) {
        try {
          const personalizedContent = replaceTemplate(emailTemplate, contact);
          
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sender: { name: senderName, email: senderEmail },
              to: [{ email: contact.email, name: contact.name }],
              subject: emailSubject,
              htmlContent: personalizedContent.replace(/\n/g, '<br>')
            })
          });

          if (response.ok) {
            results.push({
              email: contact.email,
              name: contact.name,
              status: 'success',
              message: 'Email sent successfully'
            });
          } else {
            const errorData = await response.json().catch(() => ({}));
            results.push({
              email: contact.email,
              name: contact.name,
              status: 'error',
              message: errorData.message || 'Failed to send email'
            });
          }
        } catch (emailError) {
          results.push({
            email: contact.email,
            name: contact.name,
            status: 'error',
            message: `Error: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`
          });
        }
      }
    }

    setEmailResults(results);
    setIsSending(false);

    const successCount = results.filter(r => r.status === 'success').length;
    toast({
      title: "Email Campaign Complete",
      description: `${successCount} out of ${results.length} emails sent successfully.`,
      variant: successCount > 0 ? "default" : "destructive"
    });
  };

  const getPreviewEmails = () => {
    return contacts.slice(0, 3).map(contact => ({
      ...contact,
      preview: replaceTemplate(emailTemplate, contact)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Mail Merger Tool
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automate your email workflow with personalized bulk messaging
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Configuration */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Upload Contact List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Upload CSV or Excel file with contacts</p>
                  <p className="text-sm text-gray-500 mb-4">File must contain 'name' and 'email' columns</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <Button 
                    asChild 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUploading}
                  >
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? 'Processing...' : 'Choose File'}
                    </label>
                  </Button>
                </div>
                
                {contacts.length > 0 && (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                    <p className="text-green-400 font-medium">
                      ✅ {contacts.length} contacts loaded successfully
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.keys(contacts[0]).map(key => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sender Configuration */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Sender Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sender-name" className="text-gray-200">Sender Name</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="sender-email" className="text-gray-200">Sender Email</Label>
                  <Input
                    id="sender-email"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject" className="text-gray-200">Email Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Your email subject"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Template */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Template</CardTitle>
                <p className="text-gray-400 text-sm">
                  Use placeholders like {`{{name}}`}, {`{{email}}`}, {`{{certificate}}`}, etc.
                </p>
                
                {/* Field Insertion */}
                {availableFields.length > 0 && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-gray-200 text-xs">Insert Field</Label>
                      <Select value={selectedField} onValueChange={setSelectedField}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8">
                          <SelectValue placeholder="Select field to insert" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {availableFields.map(field => (
                            <SelectItem key={field} value={field} className="text-white hover:bg-gray-600">
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={insertField}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 h-8"
                      disabled={!selectedField}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Insert
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  id="email-template"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={12}
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  placeholder="Write your email template here..."
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={contacts.length === 0}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview Emails'}
              </Button>
              <Button
                onClick={sendEmails}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSending || contacts.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Emails'}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && contacts.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Email Preview</CardTitle>
              <p className="text-gray-400">Preview of first 3 personalized emails</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {getPreviewEmails().map((contact, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 font-medium">To: {contact.name} ({contact.email})</span>
                    <Badge variant="outline">Preview {index + 1}</Badge>
                  </div>
                  <div className="bg-gray-900 rounded p-3 text-sm text-gray-300 whitespace-pre-wrap">
                    <strong>Subject:</strong> {emailSubject}
                    {'\n\n'}
                    {contact.preview}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {emailResults.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Send Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {emailResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-white text-sm">{result.name} ({result.email})</span>
                    </div>
                    <span className={`text-xs ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {result.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MailMergerApp;
