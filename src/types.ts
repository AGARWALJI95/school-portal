export interface Student {
  id: number;
  name: string;
  grade: string;
  roll_number: string;
  dob?: string;
  parent_name?: string;
  parent_contact?: string;
  address?: string;
  notes?: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface AttendanceRecord {
  id: number;
  person_id: number;
  type: 'student' | 'staff';
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

export interface Result {
  id: number;
  student_id: number;
  subject: string;
  marks: number;
  term: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Testimonial {
  id: number;
  author?: string;
  content?: string;
  rating: number;
  date: string;
}

export interface DashboardStats {
  students: number;
  staff: number;
  activities: number;
  pendingAdmissions: number;
  recentNotifications: Notification[];
  recentAdmissions: Admission[];
}

export interface Admission {
  id: number;
  student_name: string;
  grade_applied: string;
  parent_name: string;
  parent_contact: string;
  address: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  broadcast?: number;
  created_at: string;
}

export type View = 'dashboard' | 'students' | 'staff' | 'attendance' | 'activities' | 'results' | 'quiz' | 'testimonials' | 'admission' | 'notifications' | 'connect' | 'privacy';
