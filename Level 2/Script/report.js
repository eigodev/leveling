/* Download Report Button Logic */
/* This file handles the download-report button independently */

const downloadReportContainer = document.getElementById('download-report');

if (downloadReportContainer) {
    const downloadButton = document.createElement('button');
    setAttributeID(downloadButton, 'id', 'download-report-button');
    downloadButton.setAttribute('aria-label', 'Download report as PDF');
    downloadButton.innerHTML = [
        '<svg width="20" height="20" viewBox="0 0 25 25" aria-hidden="true" focusable="false">',
        '<path fill="currentColor" d="M5 20h14v-2h-2v-2h4v6H3v-6h4v2H5v2zm7-2-6-6h4V4h4v8h4l-6 6z"/>',
        '</svg>'
    ].join('');

    downloadReportContainer.appendChild(downloadButton);

    downloadButton.addEventListener('click', () => {
        // exportStudentReportPdf is defined in checkAnswers.js
        if (typeof exportStudentReportPdf === 'function') {
            exportStudentReportPdf();
        } else {
            console.warn('exportStudentReportPdf function not found. Make sure checkAnswers.js is loaded before report.js');
        }
    });
}

