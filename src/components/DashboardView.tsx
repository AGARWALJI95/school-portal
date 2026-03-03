import React from 'react';
import { Users, UserCheck, Calendar, FileText, Bell, GraduationCap } from 'lucide-react';
import { DashboardStats } from '../types';

export function DashboardView({ stats }: { stats: DashboardStats | null }) {
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-black/30 uppercase font-bold">{new Date(n.created_at).toLocaleDateString()}</p>
                    {n.broadcast === 1 && (
                      <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Broadcasted</span>
                    )}
                  </div>
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
