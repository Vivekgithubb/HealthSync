import axios from "axios";

const API_URL1 = "http://localhost:5000/api"; // local fallback
const API_URL = import.meta.env.VITE_BACKEND_URL || API_URL1;
//hotspot

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for authentication errors that aren't from the /auth endpoints
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/me") &&
      !error.config.url.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// Doctors
export const doctorsAPI = {
  getAll: () => api.get("/doctors"),
  getOne: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
};

// Documents
export const documentsAPI = {
  getAll: () => api.get("/documents"),
  getOne: (id, asBlob = false) =>
    api.get(
      `/documents/${id}`,
      asBlob
        ? {
            responseType: "blob",
            headers: {
              Accept: "application/pdf,image/*",
            },
          }
        : undefined
    ),
  upload: (formData) => {
    return api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Visits
export const visitsAPI = {
  getAll: () => api.get("/visits"),
  getOne: (id) => api.get(`/visits/${id}`),
  create: (data) => api.post("/visits", data),
  update: (id, data) => api.put(`/visits/${id}`, data),
  delete: (id) => api.delete(`/visits/${id}`),
};

// Appointments
export const appointmentsAPI = {
  getAll: () => api.get("/appointments"),
  getUpcoming: () => api.get("/appointments/upcoming"),
  getOne: (id) => api.get(`/appointments/${id}`),
  create: (data, onProgress) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      "Content-Type": "multipart/form-data",
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };

    return api.post("/appointments", data, config);
  },
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Pharmacy API
export const pharmacyAPI = {
  analyzePrescription: async (formData) => {
    console.log("Sending analysis request with formData:", {
      hasFile: formData.has("file"),
      fileDetails: formData.get("file")
        ? {
            name: formData.get("file").name,
            type: formData.get("file").type,
            size: formData.get("file").size,
          }
        : null,
    });

    const response = await api.post("/pharmacy/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Raw analysis response:", response.data);
    return response;
  },
  searchDrug: (drugName) =>
    api.get(`/pharmacy/search/${encodeURIComponent(drugName)}`),
  getAlternatives: (drugName) =>
    api.get(`/pharmacy/alternatives/${encodeURIComponent(drugName)}`),
};

export default api;
