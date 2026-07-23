const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Read the HTML file and write a temporary version with absolute paths
const htmlContent = fs.readFileSync('resume-pdf.html', 'utf8');
const tempHtmlPath = path.join(__dirname, 'temp-resume.html');

// Write temporary file
fs.writeFileSync(tempHtmlPath, htmlContent);

console.log('HTML file prepared for PDF generation.');
console.log('\nTo generate the PDF, you can:');
console.log('1. Open resume-pdf.html in your browser');
console.log('2. Press Cmd+P (Mac) or Ctrl+P (Windows/Linux)');
console.log('3. Select "Save as PDF"');
console.log('4. Save as "Spruce Feinstein Resume.pdf"');

// Try to open the file in the default browser
const platform = process.platform;
let command;

if (platform === 'darwin') {
    command = `open "${path.join(__dirname, 'resume-pdf.html')}"`;
} else if (platform === 'win32') {
    command = `start "${path.join(__dirname, 'resume-pdf.html')}"`;
} else {
    command = `xdg-open "${path.join(__dirname, 'resume-pdf.html')}"`;
}

exec(command, (error) => {
    if (!error) {
        console.log('\nOpened resume-pdf.html in your default browser.');
    }
});