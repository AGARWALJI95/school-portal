import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Edit3, Star } from 'lucide-react';
import { Testimonial } from '../types';
import { API_BASE_URL } from '../config';

export function TestimonialsView({ isAdmin }: { isAdmin: boolean }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({ author: '', content: '', rating: 5 });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    const res = await fetch(`${API_BASE_URL}/api/testimonials`);
    const data = await res.json();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTestimonial ? `${API_BASE_URL}/api/testimonials/${editingTestimonial.id}` : `${API_BASE_URL}/api/testimonials`;
    const method = editingTestimonial ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ author: '', content: '', rating: 5 });
    setShowAdd(false);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  const handleEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({ author: t.author, content: t.content, rating: t.rating || 5 });
    setShowAdd(true);
  };

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Community Feedback</h3>
            <p className="text-emerald-100 text-sm max-w-md">We value your opinion! See what our community thinks about Nakeebpur Second and share your own experience.</p>
          </div>
          <div className="flex items-center gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="text-center">
              <p className="text-4xl font-black mb-1">{averageRating.toFixed(1)}</p>
              <div className="flex gap-0.5 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-white/20'} 
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase font-bold mt-2 text-white/60 tracking-widest">Avg Rating</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-black mb-1">{testimonials.length}</p>
              <p className="text-[10px] uppercase font-bold mt-2 text-white/60 tracking-widest">Reviews</p>
            </div>
          </div>
        </div>
        <MessageSquare className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48" />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Recent Testimonials</h3>
        <button 
          onClick={() => { setEditingTestimonial(null); setFormData({ author: '', content: '', rating: 5 }); setShowAdd(true); }} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} /> Share Feedback
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold">{editingTestimonial ? 'Edit Your Feedback' : 'Share Your Experience'}</h4>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="text-xs font-bold text-yellow-700">Rating System Enabled</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              placeholder="Your Name / Role (Optional)" 
              className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" 
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})} 
            />
            
            <div className="bg-black/5 p-4 rounded-xl space-y-2">
              <p className="text-xs font-bold text-black/40 uppercase tracking-wider">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className={`p-1 transition-all transform hover:scale-110 ${formData.rating >= star ? 'text-yellow-400' : 'text-black/20'}`}
                  >
                    <Star size={28} fill={formData.rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-black/60 self-center">
                  {formData.rating} / 5
                </span>
              </div>
            </div>

            <textarea 
              placeholder="Your Testimonial (Optional)" 
              className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none h-24 focus:ring-2 focus:ring-emerald-500/20" 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
            />
            
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg shadow-emerald-600/20">
                {editingTestimonial ? 'Update' : 'Submit'} Testimonial
              </button>
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
              {isAdmin && (
                <button 
                  onClick={() => handleEdit(t)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit Testimonial"
                >
                  <Edit3 size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={star <= (t.rating || 5) ? 'text-yellow-400' : 'text-black/10'} 
                    fill={star <= (t.rating || 5) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-black/30 ml-1">{(t.rating || 5).toFixed(1)}</span>
            </div>

            {t.content && (
              <p className="text-sm text-black/70 italic mb-6 relative z-10">"{t.content}"</p>
            )}
            {!t.content && (
              <div className="mb-6 h-4" /> 
            )}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                {(t.author || 'A')[0]}
              </div>
              <div>
                <p className="text-xs font-bold">{t.author || 'Anonymous'}</p>
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
