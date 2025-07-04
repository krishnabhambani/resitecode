
interface EmailRecipient {
  email: string;
  name: string;
}

interface EmailSender {
  name: string;
  email: string;
}

interface EmailData {
  to: EmailRecipient;
  subject: string;
  htmlContent: string;
}

interface BulkEmailRequest {
  sender: EmailSender;
  emails: EmailData[];
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export const sendBulkEmails = async (request: BulkEmailRequest): Promise<EmailResult[]> => {
  const results: EmailResult[] = [];
  
  // Get API key from environment - changed to match .env file
  const apiKey = import.meta.env.VITE_BREVO_API_KEY || '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';
  
  if (!apiKey) {
    console.error('Brevo API key not found in environment variables');
    return request.emails.map(() => ({
      success: false,
      error: 'Brevo API key not configured'
    }));
  }

  // Send emails individually using Brevo transactional API
  for (const emailData of request.emails) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          sender: {
            name: request.sender.name,
            email: request.sender.email
          },
          to: [{
            email: emailData.to.email,
            name: emailData.to.name
          }],
          subject: emailData.subject,
          htmlContent: emailData.htmlContent
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Email sent successfully to ${emailData.to.email}:`, responseData);
        results.push({ success: true });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`❌ Failed to send email to ${emailData.to.email}:`, errorData);
        results.push({ 
          success: false, 
          error: errorData.message || `HTTP ${response.status}` 
        });
      }
    } catch (error) {
      console.error(`❌ Error sending email to ${emailData.to.email}:`, error);
      results.push({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      });
    }

    // Add a small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

export const sendSingleEmail = async (
  sender: EmailSender,
  recipient: EmailRecipient,
  subject: string,
  htmlContent: string
): Promise<EmailResult> => {
  const result = await sendBulkEmails({
    sender,
    emails: [{
      to: recipient,
      subject,
      htmlContent
    }]
  });
  
  return result[0] || { success: false, error: 'Unknown error' };
};
