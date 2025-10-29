import { useState, useEffect } from "react";
import { documentsAPI } from "../services/api";
import { FileText, Upload, X, Download, Trash2, Edit, Eye } from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "prescription",
    description: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await documentsAPI.getAll();
      setDocuments(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      // Auto-fill title with filename if empty
      if (!formData.title) {
        setFormData({ ...formData, title: file.name });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "prescription",
      description: "",
      tags: "",
    });
    setSelectedFile(null);
    setShowUpload(false);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("type", formData.type);
      uploadFormData.append("description", formData.description);

      if (formData.tags) {
        const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
        uploadFormData.append("tags", JSON.stringify(tagsArray));
      }

      await documentsAPI.upload(uploadFormData);
      setSuccess("Document uploaded successfully!");
      await loadDocuments();
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await documentsAPI.delete(id);
      setSuccess("Document deleted successfully!");
      await loadDocuments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log(error);
      setError("Failed to delete document");
    }
  };

  const getDocumentIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case "prescription":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "lab_report":
        return <FileText className={`${iconClass} text-green-500`} />;
      case "xray":
        return <FileText className={`${iconClass} text-purple-500`} />;
      case "scan":
        return <FileText className={`${iconClass} text-orange-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-blue-900 text-xl">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">Documents</h1>
          <p className="text-gray-500 mt-2">
            Upload and manage your medical documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Upload Document
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Select File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      {selectedFile ? (
                        <div>
                          <p className="text-blue-900 font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-medium">
                            Click to upload
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PDF, Images, or Documents (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Lab Report - Blood Test"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Document Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="prescription">Prescription</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="xray">X-Ray</option>
                    <option value="scan">Scan (CT/MRI)</option>
                    <option value="medical_record">Medical Record</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Additional notes about this document..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="blood test, annual checkup"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload Document"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first medical document to get started
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-amber-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-amber-600 transition-colors"
          >
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {doc.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {doc.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{formatDate(doc.uploadDate)}</span>
                <span>{formatFileSize(doc.fileSize)}</span>
              </div>

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </a>
                <a
                  href={doc.fileUrl}
                  download
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
