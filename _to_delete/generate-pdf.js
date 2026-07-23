const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
    try {
        // Read the HTML file
        const htmlContent = fs.readFileSync(path.join(__dirname, 'resume-pdf.html'), 'utf8');
        
        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set content with proper base URL for local files
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            baseURL: `file://${__dirname}/`
        });
        
        // Generate PDF
        await page.pdf({
            path: 'Spruce Feinstein Resume.pdf',
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        });
        
        await browser.close();
        console.log('PDF generated successfully: Spruce Feinstein Resume.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
}

generatePDF();