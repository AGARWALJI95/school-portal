import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("school.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    roll_number TEXT UNIQUE,
    dob TEXT,
    parent_name TEXT,
    parent_contact TEXT,
    address TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('student', 'staff')),
    date TEXT NOT NULL,
    status TEXT CHECK(status IN ('present', 'absent', 'late')),
    UNIQUE(person_id, type, date)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    marks INTEGER,
    term TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    questions JSON NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    content TEXT,
    rating INTEGER DEFAULT 5,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure rating column exists for existing databases
try {
  db.prepare("ALTER TABLE testimonials ADD COLUMN rating INTEGER DEFAULT 5").run();
} catch (e) {
  // Column probably already exists
}

db.exec(`

  CREATE TABLE IF NOT EXISTS admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    grade_applied TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_contact TEXT NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    broadcast INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chatbot_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    rating TEXT CHECK(rating IN ('positive', 'negative')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Seed Data
  INSERT OR IGNORE INTO students (id, name, grade, roll_number) VALUES 
    (1, 'John Doe', '10-A', '101'),
    (2, 'Jane Smith', '10-A', '102'),
    (3, 'Mike Johnson', '9-B', '901');

  INSERT OR IGNORE INTO staff (id, name, role, email) VALUES 
    (1, 'Robert Wilson', 'Principal', 'principal@school.com'),
    (2, 'Sarah Parker', 'Math Teacher', 'sarah@school.com');

  INSERT OR IGNORE INTO quizzes (id, title, questions) VALUES 
    (1, 'General Science Quiz', '[{"question": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Madrid"], "correctAnswer": 2}, {"question": "Which planet is known as the Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Saturn"], "correctAnswer": 1}]');

  INSERT OR IGNORE INTO testimonials (id, author, content) VALUES 
    (1, 'Parent of Grade 5 Student', 'Nakeebpur Second has made tracking my childs progress so much easier. The interface is clean and intuitive.'),
    (2, 'Senior Teacher', 'The attendance module saves me 15 minutes every morning. Highly recommended for any modern school.');
`);

// Migrations for existing databases
try { db.exec("ALTER TABLE staff ADD COLUMN phone TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE notifications ADD COLUMN broadcast INTEGER DEFAULT 0"); } catch (e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Admin Login
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for prototype
    if (password === "admin123") {
      res.json({ success: true, role: 'admin' });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  // Chatbot Feedback
  app.post("/api/chatbot/feedback", (req, res) => {
    const { message_text, response_text, rating } = req.body;
    db.prepare("INSERT INTO chatbot_feedback (message_text, response_text, rating) VALUES (?, ?, ?)").run(message_text, response_text, rating);
    res.json({ success: true });
  });

  // Students
  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);
  });
  app.post("/api/students", (req, res) => {
    const { name, grade, roll_number, dob, parent_name, parent_contact, address, notes } = req.body;
    const info = db.prepare(`
      INSERT INTO students (name, grade, roll_number, dob, parent_name, parent_contact, address, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, grade, roll_number, dob, parent_name, parent_contact, address, notes);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/students/:id", (req, res) => {
    const { name, grade, roll_number, dob, parent_name, parent_contact, address, notes } = req.body;
    db.prepare(`
      UPDATE students 
      SET name = ?, grade = ?, roll_number = ?, dob = ?, parent_name = ?, parent_contact = ?, address = ? , notes = ?
      WHERE id = ?
    `).run(name, grade, roll_number, dob, parent_name, parent_contact, address, notes, req.params.id);
    res.json({ success: true });
  });

  // Staff
  app.get("/api/staff", (req, res) => {
    const staff = db.prepare("SELECT * FROM staff").all();
    res.json(staff);
  });
  app.post("/api/staff", (req, res) => {
    const { name, role, email, phone } = req.body;
    const info = db.prepare("INSERT INTO staff (name, role, email, phone) VALUES (?, ?, ?, ?)").run(name, role, email, phone);
    res.json({ id: info.lastInsertRowid });
  });
  app.put("/api/staff/:id", (req, res) => {
    const { id } = req.params;
    const { name, role, email, phone } = req.body;
    db.prepare("UPDATE staff SET name = ?, role = ?, email = ?, phone = ? WHERE id = ?").run(name, role, email, phone, id);
    res.json({ success: true });
  });

  // Attendance
  app.get("/api/attendance", (req, res) => {
    const { date, type } = req.query;
    const attendance = db.prepare("SELECT * FROM attendance WHERE date = ? AND type = ?").all(date, type);
    res.json(attendance);
  });
  app.post("/api/attendance", (req, res) => {
    const { person_id, type, date, status } = req.body;
    const info = db.prepare(`
      INSERT INTO attendance (person_id, type, date, status) 
      VALUES (?, ?, ?, ?) 
      ON CONFLICT(person_id, type, date) DO UPDATE SET status=excluded.status
    `).run(person_id, type, date, status);
    res.json({ success: true });
  });

  // Activities
  app.get("/api/activities", (req, res) => {
    const activities = db.prepare("SELECT * FROM activities ORDER BY date DESC").all();
    res.json(activities);
  });
  app.post("/api/activities", (req, res) => {
    const { title, description, date, time, location } = req.body;
    db.prepare("INSERT INTO activities (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)").run(title, description, date, time, location);
    res.json({ success: true });
  });

  // Results
  app.get("/api/results/:studentId", (req, res) => {
    const results = db.prepare("SELECT * FROM results WHERE student_id = ?").all(req.params.studentId);
    res.json(results);
  });
  app.post("/api/results", (req, res) => {
    const { student_id, subject, marks, term } = req.body;
    db.prepare("INSERT INTO results (student_id, subject, marks, term) VALUES (?, ?, ?, ?)").run(student_id, subject, marks, term);
    res.json({ success: true });
  });

  // Quizzes
  app.get("/api/quizzes", (req, res) => {
    const quizzes = db.prepare("SELECT * FROM quizzes").all() as any[];
    res.json(quizzes.map(q => ({ ...q, questions: JSON.parse(q.questions as string) })));
  });
  app.post("/api/quizzes", (req, res) => {
    const { title, questions } = req.body;
    db.prepare("INSERT INTO quizzes (title, questions) VALUES (?, ?)").run(title, JSON.stringify(questions));
    res.json({ success: true });
  });

  // Testimonials
  app.get("/api/testimonials", (req, res) => {
    const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY date DESC").all();
    res.json(testimonials);
  });
  app.post("/api/testimonials", (req, res) => {
    const { author, content, rating } = req.body;
    db.prepare("INSERT INTO testimonials (author, content, rating) VALUES (?, ?, ?)").run(author, content, rating || 5);
    res.json({ success: true });
  });
  app.put("/api/testimonials/:id", (req, res) => {
    const { author, content, rating } = req.body;
    db.prepare("UPDATE testimonials SET author = ?, content = ?, rating = ? WHERE id = ?").run(author, content, rating || 5, req.params.id);
    res.json({ success: true });
  });

  // Admissions
  app.get("/api/admissions", (req, res) => {
    const admissions = db.prepare("SELECT * FROM admissions ORDER BY applied_at DESC").all();
    res.json(admissions);
  });
  app.post("/api/admissions", (req, res) => {
    const { student_name, grade_applied, parent_name, parent_contact, address } = req.body;
    db.prepare("INSERT INTO admissions (student_name, grade_applied, parent_name, parent_contact, address) VALUES (?, ?, ?, ?, ?)").run(student_name, grade_applied, parent_name, parent_contact, address);
    res.json({ success: true });
  });

  // Notifications
  app.get("/api/notifications", (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC").all();
    res.json(notifications);
  });
  app.post("/api/notifications", (req, res) => {
    const { title, message, type, broadcast } = req.body;
    db.prepare("INSERT INTO notifications (title, message, type, broadcast) VALUES (?, ?, ?, ?)").run(title, message, type, broadcast ? 1 : 0);
    
    if (broadcast) {
      const staff = db.prepare("SELECT email, phone, name FROM staff").all() as any[];
      const students = db.prepare("SELECT parent_contact, name FROM students").all() as any[];
      
      console.log(`[BROADCAST] Sending notification "${title}" to ${staff.length} staff and ${students.length} parents.`);
      
      staff.forEach(member => {
        if (member.email) {
          console.log(`[EMAIL] To: ${member.email} (${member.name}) - Subject: ${title}`);
        }
        if (member.phone) {
          console.log(`[SMS] To: ${member.phone} (${member.name}) - Message: ${title}: ${message}`);
        }
      });

      students.forEach(student => {
        if (student.parent_contact) {
          console.log(`[SMS] To: ${student.parent_contact} (Parent of ${student.name}) - Message: ${title}: ${message}`);
        }
      });
      
      return res.json({ success: true, broadcastCount: staff.length + students.length });
    }
    
    res.json({ success: true });
  });

  // Stats for Dashboard
  app.get("/api/stats", (req, res) => {
    const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as any;
    const staffCount = db.prepare("SELECT COUNT(*) as count FROM staff").get() as any;
    const activityCount = db.prepare("SELECT COUNT(*) as count FROM activities").get() as any;
    const pendingAdmissions = db.prepare("SELECT COUNT(*) as count FROM admissions WHERE status = 'pending'").get() as any;
    const recentNotifications = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 3").all();
    const recentAdmissions = db.prepare("SELECT * FROM admissions ORDER BY applied_at DESC LIMIT 3").all();
    
    res.json({
      students: studentCount.count,
      staff: staffCount.count,
      activities: activityCount.count,
      pendingAdmissions: pendingAdmissions.count,
      recentNotifications,
      recentAdmissions
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
