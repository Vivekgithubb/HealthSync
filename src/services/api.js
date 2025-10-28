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
    if (error.response?.status === 401) {
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
  getOne: (id) => api.get(`/documents/${id}`),
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
  create: (data) => api.post("/appointments", data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Pharmacy API
export const pharmacyAPI = {
  analyzePrescription: (formData) => {
    return api.post("/pharmacy/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  searchDrug: (drugName) =>
    api.get(`/pharmacy/search/${encodeURIComponent(drugName)}`),
  getAlternatives: (drugName) =>
    api.get(`/pharmacy/alternatives/${encodeURIComponent(drugName)}`),
};

export default api;
