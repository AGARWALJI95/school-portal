import React, { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Student, Result } from '../types';

export function ResultsView() {
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
