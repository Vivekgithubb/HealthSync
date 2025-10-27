import { useEffect, useMemo, useState } from 'react';
import { visitsAPI, doctorsAPI, documentsAPI } from '../services/api';
import { ClipboardList, Plus, Trash2, Calendar, Paperclip, Info, X } from 'lucide-react';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    doctor: '',
    reason: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    documents: [],
    followUpDate: ''
  });

  const selectedDoctor = useMemo(
    () => doctors.find(d => d._id === form.doctor),
    [doctors, form.doctor]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [vis, drs, dcs] = await Promise.all([
          visitsAPI.getAll(),
          doctorsAPI.getAll(),
          documentsAPI.getAll(),
        ]);
        setVisits(vis.data);
        setDoctors(drs.data);
        setDocs(dcs.data);
      } catch (e) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({
      visitDate: new Date().toISOString().slice(0, 10),
      doctor: '',
      reason: '',
      diagnosis: '',
      prescription: '',
      notes: '',
      documents: [],
      followUpDate: ''
    });
    setShowForm(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleDoc = (id) => {
    setForm(prev => ({
      ...prev,
      documents: prev.documents.includes(id)
        ? prev.documents.filter(d => d !== id)
        : [...prev.documents, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await visitsAPI.create({
        ...form,
        documents: form.documents,
      });
      setSuccess('Visit saved');
      const vis = await visitsAPI.getAll();
      setVisits(vis.data);
      resetForm();
      setTimeout(() => setSuccess(''), 2500);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save visit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this visit?')) return;
    try {
      await visitsAPI.delete(id);
      setVisits(prev => prev.filter(v => v._id !== id));
    } catch (e) {
      setError('Failed to delete visit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-blue-900 text-xl">Loading visits...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">Visit History</h1>
          <p className="text-gray-500 mt-2">Record and review your past visits</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Visit</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">{success}</div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700">{error}</div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">Add Visit</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Visit Date *</label>
                    <input
                      type="date"
                      name="visitDate"
                      value={form.visitDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Doctor *</label>
                    <select
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map(d => (
                        <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p><strong>Clinic:</strong> {selectedDoctor.clinic}</p>
                      {selectedDoctor.address && (
                        <p>
                          <strong>Address:</strong> {selectedDoctor.address.street ? selectedDoctor.address.street + ', ' : ''}
                          {selectedDoctor.address.city}{selectedDoctor.address.state ? ', ' + selectedDoctor.address.state : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Reason *</label>
                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    placeholder="Annual checkup, tooth pain, etc."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Diagnosis</label>
                    <input
                      type="text"
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Prescription</label>
                    <input
                      type="text"
                      name="prescription"
                      value={form.prescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    placeholder="Anything to remember for next time"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Attach Documents</label>
                    <div className="border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                      {docs.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No documents uploaded yet</p>
                      ) : (
                        docs.map(d => (
                          <label key={d._id} className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={form.documents.includes(d._id)}
                              onChange={() => toggleDoc(d._id)}
                            />
                            <span className="text-sm text-gray-700 truncate">{d.title}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Follow-up Date</label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={form.followUpDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Visit'}
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

      {/* Visits list */}
      {visits.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">No visits recorded</h3>
          <p className="text-gray-500 mb-6">Add your first visit entry</p>
          <button onClick={() => setShowForm(true)} className="bg-amber-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-amber-600">Add Visit</button>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map(v => (
            <div key={v._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-900 font-semibold">{v.doctor?.name || 'Unknown Doctor'}</p>
                  <p className="text-sm text-gray-500 flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>{new Date(v.visitDate).toLocaleDateString()}</span></p>
                  {v.reason && <p className="text-gray-700 mt-1">{v.reason}</p>}
                  {v.documents?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1"><Paperclip className="w-4 h-4" /><span>{v.documents.length} document(s) attached</span></p>
                  )}
                </div>
                <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
