import html2pdf from 'html2pdf.js';

export class PDFService {
  static async generatePDF(elementId: string, filename: string = 'resume.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const options = {
      margin: 0.5,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async generateBlob(elementId: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const options = {
      margin: 0.5,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true 
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    return html2pdf().set(options).from(element).outputPdf('blob');
  }
}