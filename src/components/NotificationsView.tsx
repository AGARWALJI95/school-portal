import React, { useState, useEffect } from 'react';
import { Plus, Bell } from 'lucide-react';
import { Notification } from '../types';

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' as 'info' | 'warning' | 'urgent', broadcast: false });

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
    setFormData({ title: '', message: '', type: 'info', broadcast: false });
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
            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="broadcast" 
                className="w-4 h-4 rounded border-black/10 text-emerald-600 focus:ring-emerald-500"
                checked={formData.broadcast}
                onChange={e => setFormData({...formData, broadcast: e.target.checked})}
              />
              <label htmlFor="broadcast" className="text-xs font-medium text-black/60 cursor-pointer">
                Broadcast to all staff (Email & SMS) and parents (SMS)
              </label>
            </div>
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
                <div className="flex items-center gap-2">
                  {n.broadcast === 1 && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                      Broadcasted
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
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
