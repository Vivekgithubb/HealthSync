import { useState } from 'react';
import { pharmacyAPI } from '../services/api';
import { Pill, Upload, Search, Sparkles, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function AIPharmacy() {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'search'
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [parsedMeds, setParsedMeds] = useState([]);
  const [drugInfo, setDrugInfo] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleAIParse = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setParsing(true);
    setError('');
    setParsedMeds([]);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await pharmacyAPI.parsePrescription(formData);
      setParsedMeds(response.data.medications || []);
      if (response.data.medications?.length === 0) {
        setError('No medications found in the image. Try a clearer photo.');
      }
    } catch (err) {
      console.error('Prescription parsing error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to parse prescription';
      setError(errorMsg);
    } finally {
      setParsing(false);
    }
  };

  const handleSearch = async (query) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setError('Please enter a drug name');
      return;
    }

    setSearching(true);
    setError('');
    setDrugInfo(null);
    setAlternatives(null);

    try {
      const [infoRes, altRes] = await Promise.all([
        pharmacyAPI.searchDrug(searchTerm).catch(() => null),
        pharmacyAPI.getAlternatives(searchTerm).catch(() => null)
      ]);

      if (infoRes?.data) {
        setDrugInfo(infoRes.data);
      }
      if (altRes?.data) {
        setAlternatives(altRes.data);
      }

      if (!infoRes?.data && !altRes?.data) {
        setError(`No information found for "${searchTerm}". Try a different spelling or generic name.`);
      }
    } catch (err) {
      console.error('Drug search error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch drug information';
      setError(errorMsg);
    } finally {
      setSearching(false);
    }
  };

  const handleMedicationClick = (med) => {
    setSearchQuery(med);
    setActiveTab('search');
    handleSearch(med);
  };

  const truncateText = (text, maxLength = 500) => {
    if (!text || text === 'N/A') return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-blue-900 flex items-center space-x-3">
          <Pill className="w-10 h-10 text-amber-500" />
          <span>AI Pharmacy Assistant</span>
        </h1>
        <p className="text-gray-500 mt-2">Analyze prescriptions and search drug information</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'ai'
              ? 'border-b-2 border-amber-500 text-amber-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Upload</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'search'
              ? 'border-b-2 border-amber-500 text-amber-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Manual Search</span>
          </span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Upload Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>Upload Prescription Image</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a photo of your prescription and our AI will extract medication names automatically.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors mb-4">
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
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
                    <p className="text-gray-700 font-medium mb-1">Click to upload prescription</p>
                    <p className="text-sm text-gray-500">JPG, PNG (Max 10MB)</p>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={handleAIParse}
              disabled={!selectedFile || parsing}
              className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {parsing ? (
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

          {/* Parsed Medications */}
          {parsedMeds.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Medications Found ({parsedMeds.length})</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {parsedMeds.map((med, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMedicationClick(med)}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-amber-50 hover:border-amber-500 border border-gray-200 transition-colors text-left"
                  >
                    <p className="font-semibold text-blue-900">{med}</p>
                    <p className="text-sm text-gray-500 mt-1">Click to search drug info</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Search Drug Information</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter medication name (e.g., Aspirin, Ibuprofen)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                onClick={() => handleSearch()}
                disabled={searching}
                className="bg-amber-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {searching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Drug Information Results */}
          {drugInfo && (
            <div className="space-y-4">
              {drugInfo.results?.map((drug, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">{drug.brandName}</h3>
                      {drug.genericName && drug.genericName !== 'N/A' && (
                        <p className="text-gray-600">Generic: {drug.genericName}</p>
                      )}
                      {drug.manufacturer && drug.manufacturer !== 'N/A' && (
                        <p className="text-sm text-gray-500">by {drug.manufacturer}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {drug.productType}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {drug.purpose && drug.purpose !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Purpose</h4>
                        <p className="text-gray-700">{truncateText(drug.purpose)}</p>
                      </div>
                    )}

                    {drug.dosage && drug.dosage !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Dosage & Administration</h4>
                        <p className="text-gray-700">{truncateText(drug.dosage)}</p>
                      </div>
                    )}

                    {drug.warnings && drug.warnings !== 'N/A' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>Warnings</span>
                        </h4>
                        <p className="text-yellow-800">{truncateText(drug.warnings)}</p>
                      </div>
                    )}

                    {drug.sideEffects && drug.sideEffects !== 'N/A' && (
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Side Effects</h4>
                        <p className="text-gray-700">{truncateText(drug.sideEffects)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alternatives */}
          {alternatives && alternatives.alternatives?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Alternative Medications ({alternatives.alternatives.length})
              </h3>
              {alternatives.genericName && (
                <p className="text-gray-600 mb-4">
                  Generic name: <span className="font-medium">{alternatives.genericName}</span>
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {alternatives.alternatives.map((alt, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-blue-900">{alt.brandName}</p>
                    {alt.manufacturer && alt.manufacturer !== 'N/A' && (
                      <p className="text-sm text-gray-500 mt-1">{alt.manufacturer}</p>
                    )}
                    {alt.route && alt.route !== 'N/A' && (
                      <p className="text-xs text-gray-500 mt-1">Route: {alt.route}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {activeTab === 'search' && !searching && !drugInfo && !error && searchQuery && (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Search for a medication to see detailed information</p>
            </div>
          )}
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Medical Disclaimer</p>
          <p>
            This information is provided by the OpenFDA database and AI analysis. Always consult with your healthcare
            provider before taking any medication. This tool is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
