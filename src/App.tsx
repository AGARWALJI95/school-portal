import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard,
  Plus,
  Clock,
  Search,
  Bell,
  Globe,
  FileText,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  GraduationCap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { ChatBot } from './components/ChatBot';
import { DashboardStats, View } from './types';
import { API_BASE_URL } from './config';

// Import Views
import { DashboardView } from './components/DashboardView';
import { RecordsView } from './components/RecordsView';
import { AttendanceView } from './components/AttendanceView';
import { ActivitiesView } from './components/ActivitiesView';
import { ResultsView } from './components/ResultsView';
import { QuizView } from './components/QuizView';
import { TestimonialsView } from './components/TestimonialsView';
import { AdmissionView } from './components/AdmissionView';
import { NotificationsView } from './components/NotificationsView';
import { ConnectView } from './components/ConnectView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetchStats();
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') setIsAdmin(true);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError('Please enter the admin password');
      return;
    }
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        setShowLoginModal(false);
        setPassword('');
      } else {
        setLoginError('Invalid password');
      }
    } catch (err) {
      setLoginError('Login failed');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView stats={stats} isAdmin={isAdmin} />;
      case 'students': return <RecordsView type="student" isAdmin={isAdmin} />;
      case 'staff': return <RecordsView type="staff" isAdmin={isAdmin} />;
      case 'attendance': return <AttendanceView isAdmin={isAdmin} />;
      case 'activities': return <ActivitiesView isAdmin={isAdmin} />;
      case 'results': return <ResultsView isAdmin={isAdmin} />;
      case 'quiz': return <QuizView isAdmin={isAdmin} />;
      case 'testimonials': return <TestimonialsView isAdmin={isAdmin} />;
      case 'admission': return <AdmissionView isAdmin={isAdmin} />;
      case 'notifications': return <NotificationsView isAdmin={isAdmin} />;
      case 'connect': return <ConnectView />;
      case 'privacy': return <PrivacyPolicyView />;
      default: return <DashboardView stats={stats} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-black/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xs leading-tight font-black text-blue-700 uppercase">Primary School</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-blue-700 font-black uppercase tracking-widest">Nakeebpur 2nd</span>
                <span className="text-[7px] text-red-600 font-bold italic">Since 1954</span>
              </div>
            </div>
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-black/40 hover:text-black">
            <Plus className="rotate-45" size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Management</div>
          <NavItem active={currentView === 'students'} onClick={() => { setCurrentView('students'); setIsSidebarOpen(false); }} icon={<Users size={20} />} label="Students" />
          <NavItem active={currentView === 'staff'} onClick={() => { setCurrentView('staff'); setIsSidebarOpen(false); }} icon={<UserCheck size={20} />} label="Staff" />
          <NavItem active={currentView === 'attendance'} onClick={() => { setCurrentView('attendance'); setIsSidebarOpen(false); }} icon={<Clock size={20} />} label="Attendance" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Academic</div>
          <NavItem active={currentView === 'activities'} onClick={() => { setCurrentView('activities'); setIsSidebarOpen(false); }} icon={<Calendar size={20} />} label="Activities" />
          <NavItem active={currentView === 'results'} onClick={() => { setCurrentView('results'); setIsSidebarOpen(false); }} icon={<BookOpen size={20} />} label="Results" />
          <NavItem active={currentView === 'quiz'} onClick={() => { setCurrentView('quiz'); setIsSidebarOpen(false); }} icon={<Plus size={20} />} label="Quizzes" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-black/40">Community</div>
          <NavItem active={currentView === 'admission'} onClick={() => { setCurrentView('admission'); setIsSidebarOpen(false); }} icon={<FileText size={20} />} label="Online Admission" />
          <NavItem active={currentView === 'notifications'} onClick={() => { setCurrentView('notifications'); setIsSidebarOpen(false); }} icon={<Bell size={20} />} label="Notifications" />
          <NavItem active={currentView === 'testimonials'} onClick={() => { setCurrentView('testimonials'); setIsSidebarOpen(false); }} icon={<MessageSquare size={20} />} label="Testimonials" />
          <NavItem active={currentView === 'connect'} onClick={() => { setCurrentView('connect'); setIsSidebarOpen(false); }} icon={<Globe size={20} />} label="Connect With Us" />
          <NavItem active={currentView === 'privacy'} onClick={() => { setCurrentView('privacy'); setIsSidebarOpen(false); }} icon={<Shield size={20} />} label="Privacy Policy" />
        </nav>

        <div className="p-4 border-t border-black/5 space-y-3">
          <button 
            onClick={() => { setCurrentView('testimonials'); setIsSidebarOpen(false); }}
            className="w-full p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center gap-3 group hover:bg-yellow-400/20 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black shadow-sm">
              <Star size={16} fill="currentColor" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-tight text-yellow-700">Love our school?</p>
              <p className="text-xs font-bold text-black/80">Rate Us Now</p>
            </div>
          </button>

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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-10 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
            <h2 className="font-bold capitalize text-lg lg:text-xl tracking-tight">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:relative md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-10 pr-4 py-2 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 lg:w-64 transition-all"
              />
            </div>
            {isAdmin ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <Unlock size={16} />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Lock size={16} />
                Admin Login
              </button>
            )}
            <button className="p-2 text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
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
        </div>
      </main>
      <ChatBot />

      {/* Floating Rate Us Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[40] flex flex-col gap-2">
        <motion.button
          whileHover={{ x: -10 }}
          onClick={() => setCurrentView('testimonials')}
          className="bg-yellow-400 text-black px-4 py-3 rounded-l-2xl shadow-2xl flex items-center gap-2 font-bold text-xs border-y border-l border-yellow-500/20 group transition-all"
        >
          <div className="flex flex-col items-center">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={10} fill="currentColor" className="text-black" />
              ))}
            </div>
            <span className="uppercase tracking-tighter">Rate Us</span>
          </div>
        </motion.button>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Admin Access</h3>
                <p className="text-sm text-black/40 mb-6">Enter password to unlock administrative powers.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-black/40 ml-1">Password</label>
                    <input 
                      type="password"
                      placeholder="••••••••" 
                      className="w-full p-4 bg-black/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  {loginError && <p className="text-xs text-red-500 font-bold">{loginError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="flex-1 py-3 bg-black/5 rounded-2xl text-sm font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-700/20"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
