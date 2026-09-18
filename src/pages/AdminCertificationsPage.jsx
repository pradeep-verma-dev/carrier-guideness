import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

const AdminCertificationsPage = () => {
  const { token } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', provider: 'AWS', category: 'Cloud', difficulty: 'Beginner', duration: '2 Months Prep', link: ''
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const response = await fetch('/api/admin/certifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCerts(data);
    } catch (err) {
      console.error('Error fetching certs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', provider: 'AWS', category: 'Cloud', difficulty: 'Beginner', duration: '2 Months Prep', link: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cert) => {
    setEditingId(cert.id);
    setFormData({
      name: cert.name,
      provider: cert.provider,
      category: cert.category,
      difficulty: cert.difficulty,
      duration: cert.duration,
      link: cert.link
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification entry?')) return;
    try {
      const response = await fetch(`/api/admin/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchCerts();
    } catch (err) {
      alert('Failed to delete certification');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = '/api/admin/certifications';
      let method = 'POST';
      if (editingId) {
        url = `/api/admin/certifications/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchCerts();
      }
    } catch (err) {
      alert('Failed to save certification');
    }
  };

  const filteredCerts = certs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Accreditation Management</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Manage Certifications</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure industry certification records.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => exportToCSV(filteredCerts, 'certifications_list.csv')}
              className="inline-flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading certifications...</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-semibold">{c.provider}</td>
                    <td className="py-3.5 px-4 text-slate-700">{c.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.difficulty}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.duration}</td>
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <button onClick={() => handleOpenEditModal(c)} className="text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">{editingId ? 'Edit Certification' : 'Add Certification'}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold mb-1">Certification Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Provider</label>
                    <input type="text" required value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Difficulty</label>
                    <input type="text" required value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Duration</label>
                    <input type="text" required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">URL Link</label>
                  <input type="url" required value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminCertificationsPage;
