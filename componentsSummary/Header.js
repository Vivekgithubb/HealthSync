import React from 'react';

const Header = () => (
    <>
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
            AI Prescription Document Analyzer
        </h1>
        <p className="text-gray-600 mb-8">
            Upload an image or PDF of a prescription. Gemini will perform OCR to extract structured data and generate a comprehensive summary.
        </p>
    </>
);

export default Header;