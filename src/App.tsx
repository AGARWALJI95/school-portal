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
  Clock,
  Search,
  Bell,
  Globe,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { ChatBot } from './components/ChatBot';
import { DashboardStats, View } from './types';

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
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Logo className="w-12 h-12" />
            <div className="flex flex-col">
              <span className="text-sm leading-tight font-black text-blue-700">P S NAKEEBPUR</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-blue-700 font-black uppercase tracking-widest">2ND</span>
                <span className="text-[8px] text-red-600 font-bold italic">Since 1954</span>
              </div>
            </div>
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
      <ChatBot />
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
