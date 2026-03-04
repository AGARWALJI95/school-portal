import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function AttendanceView({ isAdmin }: { isAdmin: boolean }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'student' | 'staff'>('student');
  const [people, setPeople] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchData();
  }, [date, type]);

  const fetchData = async () => {
    const [pRes, aRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/${type === 'student' ? 'students' : 'staff'}`),
      fetch(`${API_BASE_URL}/api/attendance?date=${date}&type=${type}`)
    ]);
    const pData = await pRes.json();
    const aData = await aRes.json();
    setPeople(pData);
    const attMap: Record<number, string> = {};
    aData.forEach((a: any) => attMap[a.person_id] = a.status);
    setAttendance(attMap);
  };

  const markAttendance = async (personId: number, status: string) => {
    await fetch(`${API_BASE_URL}/api/attendance`, {
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
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                    {isAdmin ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => markAttendance(person.id, 'present')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Present"><CheckCircle2 size={18} /></button>
                        <button onClick={() => markAttendance(person.id, 'absent')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Absent"><XCircle size={18} /></button>
                        <button onClick={() => markAttendance(person.id, 'late')} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors" title="Late"><Clock size={18} /></button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-black/20 italic">Admin Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-black/5">
          {people.map(person => (
            <div key={person.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{person.name}</p>
                  <p className="text-xs text-black/40">{type === 'student' ? `Grade ${person.grade}` : person.role}</p>
                </div>
                <div className="flex gap-1">
                  {isAdmin ? (
                    <>
                      <button onClick={() => markAttendance(person.id, 'present')} className={`p-2 rounded-lg transition-colors ${attendance[person.id] === 'present' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}><CheckCircle2 size={18} /></button>
                      <button onClick={() => markAttendance(person.id, 'absent')} className={`p-2 rounded-lg transition-colors ${attendance[person.id] === 'absent' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}><XCircle size={18} /></button>
                      <button onClick={() => markAttendance(person.id, 'late')} className={`p-2 rounded-lg transition-colors ${attendance[person.id] === 'late' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-600'}`}><Clock size={18} /></button>
                    </>
                  ) : (
                    <span className="text-[10px] text-black/20 italic">Admin Only</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-black/40 uppercase font-bold tracking-wider">Current Status</span>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
