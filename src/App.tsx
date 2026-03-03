import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  MapPin,
  Bell,
  Send,
  Mail,
  Phone,
  Globe,
  Map as MapIcon,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Staff, Activity, Result, Quiz, Testimonial, DashboardStats, Admission, Notification } from './types';

type View = 'dashboard' | 'students' | 'staff' | 'attendance' | 'activities' | 'results' | 'quiz' | 'testimonials' | 'admission' | 'notifications' | 'connect';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView stats={stats} />;
      case 'students': return <RecordsView type="student" />;
      case 'staff': return <RecordsView type="staff" />;
      case 'attendance': return <AttendanceView />;
      case 'activities': return <ActivitiesView />;
      case 'results': return <ResultsView />;
      case 'quiz': return <QuizView />;
      case 'testimonials': return <TestimonialsView />;
      case 'admission': return <AdmissionView />;
      case 'notifications': return <NotificationsView />;
      case 'connect': return <ConnectView />;
      default: return <DashboardView stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col">
        <div className="p-6 border-b border-black/5">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            Nakeebpur Second
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Management</div>
          <NavItem active={currentView === 'students'} onClick={() => setCurrentView('students')} icon={<Users size={20} />} label="Students" />
          <NavItem active={currentView === 'staff'} onClick={() => setCurrentView('staff')} icon={<UserCheck size={20} />} label="Staff" />
          <NavItem active={currentView === 'attendance'} onClick={() => setCurrentView('attendance')} icon={<Clock size={20} />} label="Attendance" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Academic</div>
          <NavItem active={currentView === 'activities'} onClick={() => setCurrentView('activities')} icon={<Calendar size={20} />} label="Activities" />
          <NavItem active={currentView === 'results'} onClick={() => setCurrentView('results')} icon={<BookOpen size={20} />} label="Results" />
          <NavItem active={currentView === 'quiz'} onClick={() => setCurrentView('quiz')} icon={<Plus size={20} />} label="Quizzes" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Community</div>
          <NavItem active={currentView === 'admission'} onClick={() => setCurrentView('admission')} icon={<FileText size={20} />} label="Online Admission" />
          <NavItem active={currentView === 'notifications'} onClick={() => setCurrentView('notifications')} icon={<Bell size={20} />} label="Notifications" />
          <NavItem active={currentView === 'testimonials'} onClick={() => setCurrentView('testimonials')} icon={<MessageSquare size={20} />} label="Testimonials" />
          <NavItem active={currentView === 'connect'} onClick={() => setCurrentView('connect')} icon={<Globe size={20} />} label="Connect With Us" />
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Admin User</p>
              <p className="text-[10px] text-black/40 truncate">School Principal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="font-semibold capitalize">{currentView}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-10 pr-4 py-2 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
          : 'text-black/60 hover:bg-black/5 hover:text-black'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// --- Views ---

function DashboardView({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={stats?.students || 0} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Active Staff" value={stats?.staff || 0} icon={<UserCheck className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard label="Upcoming Activities" value={stats?.activities || 0} icon={<Calendar className="text-orange-600" />} color="bg-orange-50" />
        <StatCard label="Pending Admissions" value={stats?.pendingAdmissions || 0} icon={<FileText className="text-purple-600" />} color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Bell size={18} className="text-emerald-600" />
            Latest Notifications
          </h3>
          <div className="space-y-4">
            {stats?.recentNotifications?.map(n => (
              <div key={n.id} className="flex items-start gap-3 py-3 border-b border-black/5 last:border-0">
                <div className={`p-2 rounded-lg ${n.type === 'urgent' ? 'bg-red-50 text-red-600' : 'bg-black/5 text-black/40'}`}>
                  <Bell size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{n.title}</p>
                  <p className="text-xs text-black/60 line-clamp-1">{n.message}</p>
                  <p className="text-[10px] text-black/30 mt-1 uppercase font-bold">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {(!stats?.recentNotifications || stats.recentNotifications.length === 0) && (
              <p className="text-sm text-black/30 italic py-4 text-center">No recent notifications.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-blue-600" />
            New Admission Requests
          </h3>
          <div className="space-y-4">
            {stats?.recentAdmissions?.map(app => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {app.student_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{app.student_name}</p>
                    <p className="text-[10px] text-black/40">Grade {app.grade_applied}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                  app.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {(!stats?.recentAdmissions || stats.recentAdmissions.length === 0) && (
              <p className="text-sm text-black/30 italic py-4 text-center">No recent applications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-black/40 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function RecordsView({ type }: { type: 'student' | 'staff' }) {
  const [records, setRecords] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [viewingRecord, setViewingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', grade: '', roll_number: '', role: '', email: '', 
    dob: '', parent_name: '', parent_contact: '', address: '', notes: '' 
  });

  useEffect(() => {
    fetchRecords();
  }, [type]);

  const fetchRecords = async () => {
    const res = await fetch(`/api/${type === 'student' ? 'students' : 'staff'}`);
    const data = await res.json();
    setRecords(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingRecord 
      ? `/api/${type === 'student' ? 'students' : 'staff'}/${editingRecord.id}`
      : `/api/${type === 'student' ? 'students' : 'staff'}`;
    
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
      name: '', grade: '', roll_number: '', role: '', email: '', 
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
        <button 
          onClick={() => { resetForm(); setShowAdd(true); }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Add {type === 'student' ? 'Student' : 'Staff'}
        </button>
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
                  <button 
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:underline text-xs font-bold"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-sm italic">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
              <ProfileField label="Email Address" value={viewingRecord.email} />
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

function AttendanceView() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'student' | 'staff'>('student');
  const [people, setPeople] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchData();
  }, [date, type]);

  const fetchData = async () => {
    const [pRes, aRes] = await Promise.all([
      fetch(`/api/${type === 'student' ? 'students' : 'staff'}`),
      fetch(`/api/attendance?date=${date}&type=${type}`)
    ]);
    const pData = await pRes.json();
    const aData = await aRes.json();
    setPeople(pData);
    const attMap: Record<number, string> = {};
    aData.forEach((a: any) => attMap[a.person_id] = a.status);
    setAttendance(attMap);
  };

  const markAttendance = async (personId: number, status: string) => {
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: personId, type, date, status })
    });
    setAttendance({ ...attendance, [personId]: status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 p-1 bg-black/5 rounded-xl">
          <button 
            onClick={() => setType('student')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'student' ? 'bg-white shadow-sm text-emerald-600' : 'text-black/40'}`}
          >
            Students
          </button>
          <button 
            onClick={() => setType('staff')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'staff' ? 'bg-white shadow-sm text-emerald-600' : 'text-black/40'}`}
          >
            Staff
          </button>
        </div>
        <input 
          type="date" 
          value={date}
          onChange={e => setDate(e.target.value)}
          className="p-2 bg-white border border-black/5 rounded-xl text-sm font-medium outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-wider text-black/40">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">{type === 'student' ? 'Grade' : 'Role'}</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {people.map(person => (
              <tr key={person.id} className="hover:bg-black/[0.02] transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{person.name}</td>
                <td className="px-6 py-4 text-sm text-black/60">{type === 'student' ? person.grade : person.role}</td>
                <td className="px-6 py-4">
                  {attendance[person.id] ? (
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      attendance[person.id] === 'present' ? 'bg-emerald-100 text-emerald-700' :
                      attendance[person.id] === 'absent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {attendance[person.id]}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-black/5 text-black/40 italic">Not Marked</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => markAttendance(person.id, 'present')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Present"><CheckCircle2 size={18} /></button>
                    <button onClick={() => markAttendance(person.id, 'absent')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Absent"><XCircle size={18} /></button>
                    <button onClick={() => markAttendance(person.id, 'late')} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors" title="Late"><Clock size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivitiesView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    const res = await fetch('/api/activities');
    const data = await res.json();
    setActivities(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ title: '', description: '', date: '', time: '', location: '' });
    setShowAdd(false);
    fetchActivities();
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const filteredActivities = activities.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold">Activities Calendar</h3>
          <div className="flex items-center gap-2 bg-black/5 p-1 rounded-xl">
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold px-2 py-1 outline-none"
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold px-2 py-1 outline-none"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20"><Plus size={18} /> Add Event</button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg animate-in zoom-in-95">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Event Name</label>
                <input placeholder="Event Title" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Date</label>
                <input type="date" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Time</label>
                <input type="time" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Location</label>
                <input placeholder="Event Location" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Description</label>
              <textarea placeholder="Brief description of the event..." className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium">Post Activity</button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-black/5 px-6 py-2 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit">
                  {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {activity.time && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-black/40 ml-1">
                    <Clock size={10} /> {activity.time}
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-black/20 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h4 className="font-bold text-lg mb-2">{activity.title}</h4>
            {activity.location && (
              <p className="text-xs font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                <Search size={12} /> {activity.location}
              </p>
            )}
            <p className="text-sm text-black/60 line-clamp-3">{activity.description}</p>
          </div>
        ))}
        {filteredActivities.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-black/10 text-black/30 italic">
            No events scheduled for {months[selectedMonth]} {selectedYear}.
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ subject: '', marks: 0, term: 'Final' });

  useEffect(() => {
    fetch('/api/students').then(res => res.json()).then(setStudents);
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetch(`/api/results/${selectedStudent}`).then(res => res.json()).then(setResults);
    }
  }, [selectedStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, student_id: selectedStudent })
    });
    setFormData({ subject: '', marks: 0, term: 'Final' });
    setShowAdd(false);
    fetch(`/api/results/${selectedStudent}`).then(res => res.json()).then(setResults);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-black/5 bg-black/[0.02]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black/40">Select Student</h4>
          </div>
          <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
            {students.map(s => (
              <button 
                key={s.id} 
                onClick={() => setSelectedStudent(s.id)}
                className={`w-full p-4 text-left hover:bg-black/[0.02] transition-colors ${selectedStudent === s.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''}`}
              >
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-[10px] text-black/40">Grade {s.grade} • Roll {s.roll_number}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Academic Performance</h3>
                <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus size={18} /> Add Result</button>
              </div>

              {showAdd && (
                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input placeholder="Subject" className="p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
                    <input type="number" placeholder="Marks" className="p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.marks} onChange={e => setFormData({...formData, marks: parseInt(e.target.value)})} required />
                    <select className="p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}>
                      <option>Mid Term</option>
                      <option>Final</option>
                      <option>Unit Test</option>
                    </select>
                    <div className="md:col-span-3 flex gap-2">
                      <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium">Save Result</button>
                      <button type="button" onClick={() => setShowAdd(false)} className="bg-black/5 px-6 py-2 rounded-xl text-sm font-medium">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-wider text-black/40">
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Term</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {results.map(r => (
                      <tr key={r.id}>
                        <td className="px-6 py-4 text-sm font-medium">{r.subject}</td>
                        <td className="px-6 py-4 text-sm text-black/60">{r.term}</td>
                        <td className="px-6 py-4 text-sm font-bold">{r.marks}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.marks >= 80 ? 'bg-emerald-100 text-emerald-700' : r.marks >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {r.marks >= 90 ? 'A+' : r.marks >= 80 ? 'A' : r.marks >= 70 ? 'B' : r.marks >= 60 ? 'C' : r.marks >= 40 ? 'D' : 'F'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-sm italic">No results recorded for this student.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-black/30 space-y-4 py-20">
              <BookOpen size={48} />
              <p className="text-sm font-medium">Select a student from the list to view results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizView() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch('/api/quizzes').then(res => res.json()).then(setQuizzes);
  }, []);

  const handleAnswer = (index: number) => {
    if (!activeQuiz) return;
    if (index === activeQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  if (activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-black/5 shadow-xl">
        {!finished ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-600">{activeQuiz.title}</h3>
              <span className="text-xs font-bold text-black/40">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl font-bold">{activeQuiz.questions[currentQuestion].question}</h2>
            <div className="grid grid-cols-1 gap-3">
              {activeQuiz.questions[currentQuestion].options.map((option, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className="p-4 text-left rounded-2xl border border-black/5 hover:border-emerald-600 hover:bg-emerald-50 transition-all font-medium text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            <p className="text-black/60">You scored <span className="text-emerald-600 font-bold text-xl">{score}</span> out of {activeQuiz.questions.length}</p>
            <button 
              onClick={() => { setActiveQuiz(null); setFinished(false); setCurrentQuestion(0); setScore(0); }}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20"
            >
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Interactive Learning Quizzes</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h4 className="font-bold mb-2">{quiz.title}</h4>
            <p className="text-xs text-black/40 mb-4">{quiz.questions.length} Questions • Multiple Choice</p>
            <button 
              onClick={() => setActiveQuiz(quiz)}
              className="w-full py-2 rounded-xl bg-black/5 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              Start Quiz
            </button>
          </div>
        ))}
        {/* Mock Add Quiz Button */}
        <div className="bg-dashed border-2 border-dashed border-black/10 rounded-2xl p-6 flex flex-col items-center justify-center text-black/30 hover:border-emerald-600/30 hover:text-emerald-600/50 transition-all cursor-pointer">
          <Plus size={32} className="mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Create New Quiz</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ author: '', content: '' });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ author: '', content: '' });
    setShowAdd(false);
    fetchTestimonials();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">What People Say About Nakeebpur Second</h3>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus size={18} /> Share Feedback</button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Your Name / Role" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
            <textarea placeholder="Your Testimonial" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none h-24" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium">Submit Testimonial</button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-black/5 px-6 py-2 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative overflow-hidden">
            <MessageSquare className="absolute -right-4 -bottom-4 text-black/[0.03] w-24 h-24" />
            <p className="text-sm text-black/70 italic mb-6 relative z-10">"{t.content}"</p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                {t.author[0]}
              </div>
              <div>
                <p className="text-xs font-bold">{t.author}</p>
                <p className="text-[10px] text-black/40">{new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full py-20 text-center text-black/30 italic">No testimonials yet. Be the first to share!</div>
        )}
      </div>
    </div>
  );
}

function AdmissionView() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    grade_applied: '',
    parent_name: '',
    parent_contact: '',
    email: '',
    address: ''
  });

  useEffect(() => { fetchAdmissions(); }, []);

  const fetchAdmissions = async () => {
    const res = await fetch('/api/admissions');
    const data = await res.json();
    setAdmissions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({
      student_name: '',
      grade_applied: '',
      parent_name: '',
      parent_contact: '',
      email: '',
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
              <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Email Address</label>
              <input 
                type="email"
                placeholder="Email Address" 
                className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
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

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-black/[0.01]">
          <h4 className="font-bold">Recent Applications</h4>
        </div>
        <div className="overflow-x-auto">
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
                    <button 
                      onClick={() => openMap(app.address)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View Address on Map"
                    >
                      <MapPin size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {admissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-black/30 italic text-sm">No applications received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' as 'info' | 'warning' | 'urgent' });

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ title: '', message: '', type: 'info' });
    setShowAdd(false);
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">School Notifications & Alerts</h3>
        <button 
          onClick={() => setShowAdd(true)} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Post Notification
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Notification Title" 
                className="p-3 bg-black/5 rounded-xl text-sm outline-none" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
              <select 
                className="p-3 bg-black/5 rounded-xl text-sm outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent / Alert</option>
              </select>
            </div>
            <textarea 
              placeholder="Notification Message" 
              className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none h-24" 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value})} 
              required 
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium">Post Now</button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-black/5 px-6 py-2 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`p-6 rounded-2xl border flex gap-4 items-start transition-all hover:shadow-md ${
              n.type === 'urgent' ? 'bg-red-50 border-red-100' :
              n.type === 'warning' ? 'bg-orange-50 border-orange-100' : 'bg-white border-black/5'
            }`}
          >
            <div className={`p-3 rounded-xl ${
              n.type === 'urgent' ? 'bg-red-100 text-red-600' :
              n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg">{n.title}</h4>
                <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-black/60 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-black/10 text-black/30 italic">
            No active notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectView() {
  const schoolAddress = "Primary School Nakeebpur Second, Nakeebpur, Uttar Pradesh, India";
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <ContactItem 
                icon={<MapPin className="text-emerald-600" />} 
                label="Our Location" 
                value={schoolAddress} 
                action={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
              />
              <ContactItem 
                icon={<Phone className="text-blue-600" />} 
                label="Phone Number" 
                value="+91 12345 67890" 
                action={() => window.location.href = 'tel:+911234567890'}
              />
              <ContactItem 
                icon={<Mail className="text-orange-600" />} 
                label="Email Address" 
                value="info@nakeebpursecond.edu.in" 
                action={() => window.location.href = 'mailto:info@nakeebpursecond.edu.in'}
              />
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-600/20">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
              Stay updated with our latest news, events, and academic achievements through our social media channels.
            </p>
            <div className="flex gap-4">
              <SocialBtn icon={<Globe size={20} />} label="Website" />
              <SocialBtn icon={<Send size={20} />} label="Telegram" />
              <SocialBtn icon={<MessageSquare size={20} />} label="WhatsApp" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm h-[500px] flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <h4 className="font-bold flex items-center gap-2">
              <MapIcon size={18} className="text-emerald-600" />
              Find Us on Map
            </h4>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Open in Google Maps
            </button>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden bg-black/5 relative">
            <iframe 
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(schoolAddress)}`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
            {/* Fallback overlay if API key is missing */}
            {!process.env.GOOGLE_MAPS_API_KEY && (
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <MapPin size={48} className="text-black/20 mb-4" />
                <p className="text-sm font-bold text-black/40 mb-2">Google Maps Embed</p>
                <p className="text-xs text-black/30 mb-6">Please configure GOOGLE_MAPS_API_KEY in secrets to see the interactive map.</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20"
                >
                  View on Google Maps
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value, action }: { icon: React.ReactNode, label: string, value: string, action: () => void }) {
  return (
    <div className="flex gap-4 group cursor-pointer" onClick={action}>
      <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center transition-all group-hover:bg-emerald-50">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">{label}</p>
        <p className="text-sm font-bold text-black/80 group-hover:text-emerald-600 transition-colors">{value}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
