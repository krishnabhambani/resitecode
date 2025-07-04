
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Lead } from '@/lib/lead-types';
import { newLeadGenerationService } from '@/lib/new-lead-generation-service';
import { useToast } from '@/hooks/use-toast';

interface LeadExportButtonsProps {
  leads: Lead[];
}

const LeadExportButtons: React.FC<LeadExportButtonsProps> = ({ leads }) => {
  const { toast } = useToast();

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCSVExport = async () => {
    try {
      const csvContent = await newLeadGenerationService.exportLeads(leads, 'csv');
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(csvContent, `leads-${timestamp}.csv`, 'text/csv');
      
      toast({
        title: "CSV Export Successful",
        description: `Downloaded ${leads.length} leads as CSV file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export leads as CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExcelExport = async () => {
    try {
      // Using XLSX library for Excel export
      const XLSX = await import('xlsx');
      
      const worksheet = XLSX.utils.json_to_sheet(leads.map(lead => ({
        'Name': lead.name,
        'Company': lead.company,
        'Job Title': lead.jobTitle,
        'Email': lead.email || '',
        'Phone': lead.phone || '',
        'Location': lead.location,
        'Industry': lead.industry,
        'Platform': lead.platform || '',
        'Score': lead.score,
        'LinkedIn URL': lead.linkedinUrl || '',
        'Source URL': lead.sourceUrl || '',
        'Company Size': lead.companySize || ''
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      
      const timestamp = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `leads-${timestamp}.xlsx`);
      
      toast({
        title: "Excel Export Successful",
        description: `Downloaded ${leads.length} leads as Excel file.`,
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Excel Export Failed",
        description: "Failed to export leads as Excel file. Try CSV export instead.",
        variant: "destructive",
      });
    }
  };

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleCSVExport}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button
        onClick={handleExcelExport}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>
  );
};

export default LeadExportButtons;
