import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Edit3 } from 'lucide-react';
import { Testimonial } from '../types';

export function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({ author: '', content: '' });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials';
    const method = editingTestimonial ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ author: '', content: '' });
    setShowAdd(false);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  const handleEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({ author: t.author, content: t.content });
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">What People Say About Nakeebpur Second</h3>
        <button onClick={() => { setEditingTestimonial(null); setFormData({ author: '', content: '' }); setShowAdd(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Plus size={18} /> Share Feedback</button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg">
          <h4 className="font-bold mb-4">{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Your Name / Role" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
            <textarea placeholder="Your Testimonial" className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none h-24" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium">{editingTestimonial ? 'Update' : 'Submit'} Testimonial</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditingTestimonial(null); }} className="bg-black/5 px-6 py-2 rounded-xl text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative overflow-hidden group">
            <MessageSquare className="absolute -right-4 -bottom-4 text-black/[0.03] w-24 h-24" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(t)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edit Testimonial"
              >
                <Edit3 size={14} />
              </button>
            </div>
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
