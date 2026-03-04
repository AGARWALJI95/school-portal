import React, { useState, useEffect } from 'react';
import { Plus, XCircle, FileText, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Admission } from '../types';
import { API_BASE_URL } from '../config';

export function AdmissionView({ isAdmin }: { isAdmin: boolean }) {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    grade_applied: '',
    parent_name: '',
    parent_contact: '',
    address: ''
  });

  useEffect(() => { fetchAdmissions(); }, []);

  const fetchAdmissions = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admissions`);
    const data = await res.json();
    setAdmissions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({
      student_name: '',
      grade_applied: '',
      parent_name: '',
      parent_contact: '',
      address: ''
    });
    setShowForm(false);
    fetchAdmissions();
    alert("Admission application submitted successfully!");
  };

  const openMap = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Online Admission Portal</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'New Application'}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl"
        >
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText className="text-emerald-600" />
            Student Admission Form
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Student Full Name</label>
              <input 
                placeholder="Student Name" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.student_name}
                onChange={e => setFormData({...formData, student_name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Grade Applied For</label>
              <input 
                placeholder="e.g. Nursery, Grade 1" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.grade_applied}
                onChange={e => setFormData({...formData, grade_applied: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Parent / Guardian Name</label>
              <input 
                placeholder="Parent Name" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.parent_name}
                onChange={e => setFormData({...formData, parent_name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Contact Number</label>
              <input 
                placeholder="Phone Number" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.parent_contact}
                onChange={e => setFormData({...formData, parent_contact: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Residential Address</label>
              <div className="flex gap-2">
                <input 
                  placeholder="Full Address" 
                  className="flex-1 p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
                <button 
                  type="button"
                  onClick={() => openMap(formData.address)}
                  className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                  title="Verify on Map"
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isAdmin && (
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5 bg-black/[0.01]">
            <h4 className="font-bold">Recent Applications</h4>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-wider text-black/40">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Parent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {admissions.map(app => (
                  <tr key={app.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{app.student_name}</p>
                      <p className="text-[10px] text-black/40">{new Date(app.applied_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-black/60">{app.grade_applied}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{app.parent_name}</p>
                      <p className="text-[10px] text-black/40">{app.parent_contact}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openMap(app.address)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Address on Map"
                        >
                          <MapPin size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-black/5">
            {admissions.map(app => (
              <div key={app.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold">{app.student_name}</p>
                    <p className="text-[10px] text-black/40">{new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-black/40 uppercase font-bold">Grade</p>
                    <p className="font-medium">{app.grade_applied}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-black/40 uppercase font-bold">Parent</p>
                    <p className="font-medium">{app.parent_name}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/5">
                  <p className="text-xs text-black/60">{app.parent_contact}</p>
                  <button 
                    onClick={() => openMap(app.address)}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"
                  >
                    <MapPin size={14} /> View Map
                  </button>
                </div>
              </div>
            ))}
          </div>

          {admissions.length === 0 && (
            <div className="px-6 py-12 text-center text-black/30 italic text-sm">No applications received yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
