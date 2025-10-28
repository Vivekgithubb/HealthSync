import { useState } from "react";
import { pharmacyAPI } from "../services/api";
import { Pill, Upload, Sparkles, AlertCircle } from "lucide-react";
import StructuredDataDisplay from "../components/StructuredDataDisplay";
import FormattedSummary from "../components/FormattedSummary";

export default function AIPharmacy() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(
    "The detailed summary will appear here after analysis."
  );
  const [structuredData, setStructuredData] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError("File must be less than 15MB");
        return;
      }
      setSelectedFile(file);
      setError("");
      setSummary("The detailed summary will appear here after analysis.");
      setStructuredData(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a PDF or image file");
      return;
    }
    setIsLoading(true);
    setError("");
    setSummary("Processing document, please wait...");
    setStructuredData(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await pharmacyAPI.analyzePrescription(formData);
      setStructuredData(response.data.structuredData);
      setSummary(response.data.textSummary);
    } catch (err) {
      console.error("AI analysis error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "AI analysis failed. Please try again or check your file.";
      setError(errorMsg);
      setSummary("AI analysis failed. Please try again or check your file.");
      setStructuredData("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-blue-900 flex items-center space-x-3">
          <Pill className="w-10 h-10 text-amber-500" />
          <span>AI Pharmacy Analyzer</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Upload a prescription (PDF, PNG, JPG) and get an AI-powered summary
          and structured data extraction.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span>Upload Prescription</span>
        </h2>
        <p className="text-gray-600 mb-6">Accepted: PDF, PNG, JPG — max 15MB</p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors mb-4">
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,image/png,image/jpeg"
            className="hidden"
            id="ai-upload"
          />
          <label htmlFor="ai-upload" className="cursor-pointer">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            {selectedFile ? (
              <div>
                <p className="text-blue-900 font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  Click to upload prescription
                </p>
                <p className="text-sm text-gray-500">
                  PDF, PNG, JPG (Max 15MB)
                </p>
              </div>
            )}
          </label>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
          className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Prescription</span>
            </>
          )}
        </button>
      </div>

      {/* AI Summary */}
      <FormattedSummary text={summary} />

      {/* Structured Data Display */}
      {structuredData && typeof structuredData === "object" && (
        <StructuredDataDisplay data={structuredData} />
      )}

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Medical Disclaimer</p>
          <p>
            This information is provided by AI analysis. Always consult with
            your healthcare provider before taking any medication. This tool is
            for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
