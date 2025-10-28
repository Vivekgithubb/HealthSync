.import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header.js';
import LoadingSpinner from './components/LoadingSpinner';
import StructuredDataOutput from './components/StructuredDataOutput';
import './styles/customStyles.css';

// --- 1. CONFIGURATION AND CORE UTILITIES ---

const API_KEY = "AIzaSyAODcrt9KvGcbmGVtU84iub5ApXAI8hz8I"; // Automatically provided by the environment
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const MAX_RETRIES = 5;
const MAX_FILE_SIZE_MB = 15;

/**
 * Utility function to convert a File object to a Base64 string for API payload.
 * @param {File} file 
 * @returns {Promise<string>} Base64 data string (without the MIME type prefix).
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Extract only the base64 data part (after the comma)
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

/**
 * Handles API fetch requests with exponential backoff for retries.
 */
async function fetchWithRetry(url, options) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status !== 429) {
                return response;
            }
            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            console.warn(`Rate limit hit (429). Retrying in ${Math.round(delay / 1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            console.error('Fetch attempt failed:', error);
            if (i === MAX_RETRIES - 1) throw error;
            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Maximum retries reached.');
}

// Define the JSON schema for precise structured output
const prescriptionSchema = {
    type: "OBJECT",
    properties: {
        patientInfo: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING" },
                address: { type: "STRING" },
                date: { type: "STRING" },
                refills: { type: "STRING" }
            },
            required: ["name", "address", "date", "refills"]
        },
        doctorInfo: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING" },
                address: { type: "STRING" },
                phone: { type: "STRING" }
            },
            required: ["name", "address", "phone"]
        },
        medications: {
            type: "ARRAY",
            description: "A list of all prescribed medications and their strength.",
            items: {
                type: "OBJECT",
                properties: {
                    nameAndStrength: { type: "STRING" },
                    directions: { type: "STRING" }
                }
            }
        }
    },
    required: ["patientInfo", "doctorInfo", "medications"]
};

/**
 * Calls Gemini to extract structured JSON data.
 */
async function getStructuredData(base64Data, mimeType) {
    const systemPrompt = "You are an expert OCR and medical data extraction system. Your task is to precisely read the provided document image/PDF and extract the required information into the specified JSON format. DO NOT include any explanatory text or markdown outside the JSON object. If a field is not found, use 'N/A'. For prescriptions and directions, list each item separately.";
    const userQuery = "Extract all required prescription details, including patient info, doctor info, and a list of all medications and their directions.";
    
    const payload = {
        contents: [{
            role: "user",
            parts: [
                { text: userQuery },
                { inlineData: { mimeType: mimeType, data: base64Data } }
            ]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: prescriptionSchema
        },
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    }
    throw new Error("Failed to get structured data from Gemini API.");
}

/**
 * Calls Gemini to generate a patient-friendly summary.
 */
async function getTextSummary(base64Data, mimeType) {
    const userQuery = "Based on the provided prescription document, generate a concise, easy-to-read, one-paragraph summary of the patient, the doctor, and the prescribed medications and usage directions. Focus on providing clear, patient-friendly information.";
    
    const payload = {
        contents: [{
            role: "user",
            parts: [
                { text: userQuery },
                { inlineData: { mimeType: mimeType, data: base64Data } }
            ]
        }],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
    }
    throw new Error("Failed to generate text summary from Gemini API.");
}


// --- 3. MAIN APP COMPONENT ---

const App = () => {
    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [fileStatus, setFileStatus] = useState({ text: '', isError: false, previewUrl: null });
    const [uploadedFile, setUploadedFile] = useState({ data: null, mimeType: null });
    const [summary, setSummary] = useState('The detailed summary will appear here after analysis.');
    const [structuredData, setStructuredData] = useState(null);

    const isFileReady = uploadedFile.data !== null;

    // --- Event Handlers ---
    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        // Reset state
        setFileStatus({ text: '', isError: false, previewUrl: null });
        setSummary('The detailed summary will appear here after analysis.');
        setStructuredData(null);
        setUploadedFile({ data: null, mimeType: null });

        if (!file) return;

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setFileStatus({ 
                text: `Error: File size must be under ${MAX_FILE_SIZE_MB}MB for inline processing.`, 
                isError: true, 
                previewUrl: null 
            });
            return;
        }

        const mimeType = file.type;
        if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf') {
            setFileStatus({ 
                text: 'Unsupported file type. Please use PDF, PNG, or JPEG.', 
                isError: true, 
                previewUrl: null 
            });
            return;
        }

        let previewUrl = null;
        if(mimeType.startsWith('image/')) {
            previewUrl = URL.createObjectURL(file);
        }

        try {
            const base64Data = await fileToBase64(file);
            setUploadedFile({ data: base64Data, mimeType });
            setFileStatus({ 
                text: `File ready: ${file.name}`, 
                isError: false, 
                previewUrl 
            });
        } catch (err) {
            setFileStatus({ 
                text: "Error reading file: " + err.message, 
                isError: true, 
                previewUrl: null 
            });
        }
    }, []);

    const startAnalysis = useCallback(async () => {
        if (!isFileReady) return;

        setIsLoading(true);
        setSummary('Processing document, please wait...');
        setStructuredData(null);

        try {
            // Run both API calls concurrently for faster results
            const [data, textSummary] = await Promise.all([
                getStructuredData(uploadedFile.data, uploadedFile.mimeType),
                getTextSummary(uploadedFile.data, uploadedFile.mimeType)
            ]);

            setStructuredData(data);
            setSummary(textSummary);
            
        } catch (error) {
            console.error("Analysis Failed:", error);
            const errorMessage = error.message.includes('API') 
                ? 'AI processing failed. Please ensure the document is clear and under the size limit.'
                : 'An unexpected error occurred during analysis.';
            
            setSummary(errorMessage);
            setStructuredData('error');
        } finally {
            setIsLoading(false);
        }
    }, [isFileReady, uploadedFile]);

    return (
        <>
            {/* Top navigation */}
            <header className="top-nav">
                <div className="nav-inner container">
                    <div className="brand">
                        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="brand-text">Prescription Analyzer</span>
                    </div>
                    <nav className="nav-actions">
                        <button className="btn-ghost" disabled>v1.0</button>
                    </nav>
                </div>
            </header>

            <main className="app-wrap container">
                <div className="container-card mx-auto">
                    <div className="card-grid">
                        <aside className="left-panel">
                            <Header />

                            <div className="card file-card">
                                <label htmlFor="file-input" className="label">Upload Prescription</label>
                                <input 
                                    type="file" 
                                    id="file-input" 
                                    accept=".pdf,image/png,image/jpeg"
                                    className="file-input"
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                />
                                <p className={`file-status ${fileStatus.isError ? 'error' : 'ok'}`}>
                                    {fileStatus.text || 'Accepted: PDF, PNG, JPG — max 15MB'}
                                </p>

                                {fileStatus.previewUrl && (
                                    <div className="preview-wrap">
                                        <img src={fileStatus.previewUrl} alt="Preview" className="preview-img" />
                                    </div>
                                )}

                                <button 
                                    className={`btn-primary ${isLoading || !isFileReady ? 'disabled' : ''}`}
                                    onClick={startAnalysis}
                                    disabled={isLoading || !isFileReady}
                                >
                                    {isLoading ? 'Analyzing...' : 'Analyze Prescription'}
                                </button>

                                {isLoading && <div className="center mt-3"><LoadingSpinner /></div>}
                            </div>

                            <div className="card help-card">
                                <h4 className="help-title">Tips for Best Results</h4>
                                <ul className="help-list">
                                    <li>Use clear, well-lit photos or a high-quality PDF.</li>
                                    <li>Place the prescription on a plain background.</li>
                                    <li>Crop out irrelevant edges for better OCR accuracy.</li>
                                </ul>
                            </div>
                        </aside>

                        <section className="right-panel">
                            <div className="card summary-card">
                                <div className="card-header">
                                    <h3>AI Summary</h3>
                                </div>
                                <div className="summary-body">
                                    <p className={`summary-text ${isLoading ? 'muted' : ''} ${summary.includes('failed') || summary.includes('Error') ? 'error' : ''}`}>
                                        {summary}
                                    </p>
                                </div>
                            </div>

                            <div className="card data-card">
                                <div className="card-header">
                                    <h3>Structured Data Extraction</h3>
                                </div>
                                <div className="data-body">
                                    <StructuredDataOutput 
                                        isLoading={isLoading} 
                                        structuredData={structuredData} 
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                    <footer className="app-footer">
                        <small>Processed locally in-browser before sending to the API. Keep patient data secure.</small>
                    </footer>
                </div>
            </main>
        </>
    );
};

export default App;
