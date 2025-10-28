import { useEffect, useMemo, useState } from "react";
import { appointmentsAPI, doctorsAPI, documentsAPI } from "../services/api";
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Paperclip,
  Info,
  X,
  Bell,
} from "lucide-react";
import downloadBlob from "../components/Blob";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    doctor: "",
    reason: "",
    notes: "",
    documents: [],
  });

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d._id === form.doctor),
    [doctors, form.doctor]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [apts, drs, dcs] = await Promise.all([
          appointmentsAPI.getAll(),
          doctorsAPI.getAll(),
          documentsAPI.getAll(),
        ]);
        setAppointments(apts.data);
        setDoctors(drs.data);
        setDocs(dcs.data);
      } catch (e) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({
      appointmentDate: "",
      appointmentTime: "",
      doctor: "",
      reason: "",
      notes: "",
      documents: [],
    });
    setShowForm(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  // const handleDownload = (url, title) => {
  //   const link = document.createElement("a");
  //   link.href = url.replace("/upload/", "/upload/fl_attachment/");
  //   link.download = title;
  //   link.click();
  // };
  const handleDownloadDocument = async (docId, title) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEDN_URL}/api/documents/download/${docId}`
      );
      const link = document.createElement("a");
      link.href = response.data.url;
      link.download = title;
      link.click();
    } catch (error) {
      setError("Failed to download document");
    }
  };

  const toggleDoc = (id) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.includes(id)
        ? prev.documents.filter((d) => d !== id)
        : [...prev.documents, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await appointmentsAPI.create({
        ...form,
        doctor: form.manualDoctor
          ? { name: form.manualDoctorName }
          : form.doctor,
        documents: form.documents,
      });
      setSuccess("Appointment scheduled! You will receive an email reminder.");
      const apts = await appointmentsAPI.getAll();
      setAppointments(apts.data);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to schedule appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await appointmentsAPI.delete(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setSuccess("Appointment cancelled");
      setTimeout(() => setSuccess(""), 2500);
    } catch (e) {
      setError("Failed to cancel appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-blue-900 text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">Appointments</h1>
          <p className="text-gray-500 mt-2">
            Schedule and manage your appointments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Appointment</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Schedule Appointment
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={form.appointmentDate}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 10)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={form.appointmentTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Doctor *
                  </label>

                  {!form.manualDoctor ? (
                    <>
                      <select
                        name="doctor"
                        value={form.doctor}
                        onChange={handleChange}
                        required={!form.manualDoctorName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} — {d.specialty}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            manualDoctor: true,
                            doctor: "",
                          }))
                        }
                        className="text-sm text-amber-600 mt-2 hover:underline"
                      >
                        + Add doctor manually
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="manualDoctorName"
                        value={form.manualDoctorName || ""}
                        onChange={handleChange}
                        required
                        placeholder="Enter doctor's full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            manualDoctor: false,
                            manualDoctorName: "",
                          }))
                        }
                        className="text-sm text-gray-500 mt-2 hover:underline"
                      >
                        ← Select from list
                      </button>
                    </>
                  )}
                </div>

                {selectedDoctor && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p>
                        <strong>Clinic:</strong> {selectedDoctor.clinic}
                      </p>
                      {selectedDoctor.address && (
                        <p>
                          <strong>Address:</strong>{" "}
                          {selectedDoctor.address.street
                            ? selectedDoctor.address.street + ", "
                            : ""}
                          {selectedDoctor.address.city}
                          {selectedDoctor.address.state
                            ? ", " + selectedDoctor.address.state
                            : ""}
                        </p>
                      )}
                      <p>
                        <strong>Hours:</strong> {selectedDoctor.workingHours}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Reason *
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    placeholder="Checkup, consultation, follow-up, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    placeholder="Things to discuss or bring..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Attach Documents (Reports to bring)
                  </label>
                  <div className="border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                    {docs.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2">
                        No documents uploaded yet
                      </p>
                    ) : (
                      docs.map((d) => (
                        <label
                          key={d._id}
                          className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={form.documents.includes(d._id)}
                            onChange={() => toggleDoc(d._id)}
                          />
                          <span className="text-sm text-gray-700 truncate">
                            {d.title}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start space-x-2">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    You will receive an email reminder for appointments
                    scheduled within the next 2 days.
                  </p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 disabled:opacity-50"
                  >
                    {submitting ? "Scheduling..." : "Schedule Appointment"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Appointments list */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            No appointments scheduled
          </h3>
          <p className="text-gray-500 mb-6">Schedule your first appointment</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-amber-600"
          >
            Schedule Appointment
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-blue-900 font-semibold text-lg">
                    {a.doctor?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">{a.doctor?.specialty}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-sm text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(a.appointmentDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-sm text-gray-700 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{a.appointmentTime}</span>
                </p>
                {a.reason && <p className="text-gray-700 mt-2">{a.reason}</p>}
                {a.reminderSent && (
                  <p className="text-sm text-green-600 flex items-center space-x-1">
                    <Bell className="w-4 h-4" />
                    <span>Reminder sent</span>
                  </p>
                )}
                {a.documents?.length > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Paperclip className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Attached Documents
                      </span>
                    </div>
                    <div className="space-y-1">
                      {a.documents.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                        >
                          <div>
                            <p className="text-sm text-gray-800 font-medium">
                              {doc.title}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                              {doc.fileType} —{" "}
                              {(doc.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm hover:underline"
                            >
                              View
                            </a>

                            <a
                              href={doc.downloadUrl || doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="text-green-600 text-sm hover:underline"
                            >
                              Download
                            </a>
                            <button
                              onClick={() =>
                                downloadBlob(
                                  doc.downloadUrl || doc.fileUrl,
                                  doc.title
                                )
                              }
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(a._id)}
                className="w-full mt-3 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Cancel Appointment</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
