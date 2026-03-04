import React, { useState, useEffect } from 'react';
import { Plus, XCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../config';

export function RecordsView({ type, isAdmin }: { type: 'student' | 'staff', isAdmin: boolean }) {
  const [records, setRecords] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [viewingRecord, setViewingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', grade: '', roll_number: '', role: '', email: '', phone: '',
    dob: '', parent_name: '', parent_contact: '', address: '', notes: '' 
  });

  useEffect(() => {
    fetchRecords();
  }, [type]);

  const fetchRecords = async () => {
    const res = await fetch(`${API_BASE_URL}/api/${type === 'student' ? 'students' : 'staff'}`);
    const data = await res.json();
    setRecords(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingRecord 
      ? `${API_BASE_URL}/api/${type === 'student' ? 'students' : 'staff'}/${editingRecord.id}`
      : `${API_BASE_URL}/api/${type === 'student' ? 'students' : 'staff'}`;
    
    await fetch(url, {
      method: editingRecord ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    resetForm();
    fetchRecords();
  };

  const resetForm = () => {
    setFormData({ 
      name: '', grade: '', roll_number: '', role: '', email: '', phone: '',
      dob: '', parent_name: '', parent_contact: '', address: '', notes: '' 
    });
    setShowAdd(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      name: record.name || '',
      grade: record.grade || '',
      roll_number: record.roll_number || '',
      role: record.role || '',
      email: record.email || '',
      phone: record.phone || '',
      dob: record.dob || '',
      parent_name: record.parent_name || '',
      parent_contact: record.parent_contact || '',
      address: record.address || '',
      notes: record.notes || ''
    });
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">All {type === 'student' ? 'Students' : 'Staff Members'}</h3>
        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setShowAdd(true); }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Add {type === 'student' ? 'Student' : 'Staff'}
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h4 className="font-bold mb-4">{editingRecord ? 'Edit' : 'Add New'} {type === 'student' ? 'Student' : 'Staff'}</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Full Name</label>
              <input 
                placeholder="Full Name" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            {type === 'staff' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Email Address</label>
                  <input 
                    placeholder="Email Address" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Phone Number</label>
                  <input 
                    placeholder="Phone Number" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {type === 'student' ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Grade / Class</label>
                  <input 
                    placeholder="Grade (e.g. 10-A)" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.grade}
                    onChange={e => setFormData({...formData, grade: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Roll Number / Student ID</label>
                  <input 
                    placeholder="Roll Number" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.roll_number}
                    onChange={e => setFormData({...formData, roll_number: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Date of Birth</label>
                  <input 
                    type="date"
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Parent / Guardian Name</label>
                  <input 
                    placeholder="Parent Name" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.parent_name}
                    onChange={e => setFormData({...formData, parent_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Parent Contact Number</label>
                  <input 
                    placeholder="Contact Number" 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.parent_contact}
                    onChange={e => setFormData({...formData, parent_contact: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Address</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Home Address" 
                      className="flex-1 p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`, '_blank')}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                      title="Verify on Map"
                    >
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Notes / Special Considerations</label>
                  <textarea 
                    placeholder="Any special notes..." 
                    className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 h-20"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Role</label>
                <input 
                  placeholder="Role (e.g. Teacher, Admin)" 
                  className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="md:col-span-2 flex gap-2 pt-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-600/20">
                {editingRecord ? 'Update Record' : 'Save Record'}
              </button>
              <button type="button" onClick={resetForm} className="bg-black/5 px-6 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-wider text-black/40">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">{type === 'student' ? 'Grade' : 'Role'}</th>
                <th className="px-6 py-4">{type === 'student' ? 'Roll No' : 'Email'}</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-black/60">{type === 'student' ? record.grade : record.role}</td>
                  <td className="px-6 py-4 text-sm text-black/60">{type === 'student' ? record.roll_number : record.email}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button 
                      onClick={() => setViewingRecord(record)}
                      className="text-emerald-600 hover:underline text-xs font-bold"
                    >
                      View
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:underline text-xs font-bold"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-black/5">
          {records.map(record => (
            <div key={record.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{record.name}</p>
                  <p className="text-xs text-black/40">{type === 'student' ? `Grade ${record.grade}` : record.role}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setViewingRecord(record)}
                    className="text-emerald-600 text-xs font-bold"
                  >
                    View
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 text-xs font-bold"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-black/40 uppercase font-bold tracking-wider">
                <span>{type === 'student' ? 'Roll No' : 'Email'}</span>
                <span className="text-black/60">{type === 'student' ? record.roll_number : record.email}</span>
              </div>
            </div>
          ))}
        </div>
        
        {records.length === 0 && (
          <div className="px-6 py-12 text-center text-black/40 text-sm italic">No records found.</div>
        )}
      </div>

      {/* Profile View Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-black/5 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">
                  {viewingRecord.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{viewingRecord.name}</h3>
                  <p className="text-black/40 font-medium">{type === 'student' ? `Grade ${viewingRecord.grade} • Roll ${viewingRecord.roll_number}` : viewingRecord.role}</p>
                </div>
              </div>
              <button onClick={() => setViewingRecord(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <XCircle size={24} className="text-black/20" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {type === 'staff' && (
                <>
                  <ProfileField label="Email Address" value={viewingRecord.email} />
                  <ProfileField label="Phone Number" value={viewingRecord.phone || 'Not set'} />
                </>
              )}
              {type === 'student' && (
                <>
                  <ProfileField label="Date of Birth" value={viewingRecord.dob || 'Not set'} />
                  <ProfileField label="Parent / Guardian" value={viewingRecord.parent_name || 'Not set'} />
                  <ProfileField label="Parent Contact" value={viewingRecord.parent_contact || 'Not set'} />
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end">
                      <ProfileField label="Address" value={viewingRecord.address || 'Not set'} />
                      {viewingRecord.address && (
                        <button 
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(viewingRecord.address)}`, '_blank')}
                          className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline mb-1"
                        >
                          <MapPin size={12} /> View on Map
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <ProfileField label="Notes / Special Considerations" value={viewingRecord.notes || 'None'} />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 bg-black/[0.02] flex justify-end">
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-6 py-2 bg-black/5 rounded-xl text-sm font-bold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">{label}</p>
      <p className="text-sm font-medium text-black/80">{value}</p>
    </div>
  );
}
