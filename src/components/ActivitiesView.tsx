import React, { useState, useEffect } from 'react';
import { Plus, Clock, Search, ChevronRight } from 'lucide-react';
import { Activity } from '../types';

export function ActivitiesView() {
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
