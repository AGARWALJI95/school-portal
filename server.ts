import express from "express";
import { createServer as createViteServer } from "vite";
import pkg from 'pg';
const { Pool } = pkg;
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize Database
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        person_id INTEGER NOT NULL,
        type TEXT CHECK(type IN ('student', 'staff')),
        date TEXT NOT NULL,
        status TEXT CHECK(status IN ('present', 'absent', 'late')),
        UNIQUE(person_id, type, date)
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        location TEXT
      );

      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        marks INTEGER,
        term TEXT,
        FOREIGN KEY(student_id) REFERENCES students(id)
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        questions JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        author TEXT,
        content TEXT,
        rating INTEGER DEFAULT 5,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admissions (
        id SERIAL PRIMARY KEY,
        student_name TEXT NOT NULL,
        grade_applied TEXT NOT NULL,
        parent_name TEXT NOT NULL,
        parent_contact TEXT NOT NULL,
        address TEXT,
        status TEXT DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        broadcast INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chatbot_feedback (
        id SERIAL PRIMARY KEY,
        message_text TEXT NOT NULL,
        response_text TEXT NOT NULL,
        rating TEXT CHECK(rating IN ('positive', 'negative')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Data (using ON CONFLICT to avoid duplicates)
    await client.query(`
      INSERT INTO students (id, name, grade, roll_number) VALUES 
        (1, 'John Doe', '10-A', '101'),
        (2, 'Jane Smith', '10-A', '102'),
        (3, 'Mike Johnson', '9-B', '901')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO staff (id, name, role, email) VALUES 
        (1, 'Robert Wilson', 'Principal', 'principal@school.com'),
        (2, 'Sarah Parker', 'Math Teacher', 'sarah@school.com')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO quizzes (id, title, questions) VALUES 
        (1, 'General Science Quiz', '[{"question": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Madrid"], "correctAnswer": 2}, {"question": "Which planet is known as the Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Saturn"], "correctAnswer": 1}]')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO testimonials (id, author, content) VALUES 
        (1, 'Parent of Grade 5 Student', 'Nakeebpur Second has made tracking my childs progress so much easier. The interface is clean and intuitive.'),
        (2, 'Senior Teacher', 'The attendance module saves me 15 minutes every morning. Highly recommended for any modern school.')
      ON CONFLICT (id) DO NOTHING;
      
      -- Reset sequences if we inserted with IDs
      SELECT setval('students_id_seq', (SELECT MAX(id) FROM students));
      SELECT setval('staff_id_seq', (SELECT MAX(id) FROM staff));
      SELECT setval('quizzes_id_seq', (SELECT MAX(id) FROM quizzes));
      SELECT setval('testimonials_id_seq', (SELECT MAX(id) FROM testimonials));
    `);

  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    client.release();
  }
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Admin Login
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
      res.json({ success: true, role: 'admin' });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  // Chatbot Feedback
  app.post("/api/chatbot/feedback", async (req, res) => {
    const { message_text, response_text, rating } = req.body;
    try {
      await pool.query(
        "INSERT INTO chatbot_feedback (message_text, response_text, rating) VALUES ($1, $2, $3)",
        [message_text, response_text, rating]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Students
  app.get("/api/students", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/students", async (req, res) => {
    const { name, grade, roll_number, dob, parent_name, parent_contact, address, notes } = req.body;
    try {
      const result = await pool.query(`
        INSERT INTO students (name, grade, roll_number, dob, parent_name, parent_contact, address, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [name, grade, roll_number, dob, parent_name, parent_contact, address, notes]);
      res.json({ id: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    const { name, grade, roll_number, dob, parent_name, parent_contact, address, notes } = req.body;
    try {
      await pool.query(`
        UPDATE students 
        SET name = $1, grade = $2, roll_number = $3, dob = $4, parent_name = $5, parent_contact = $6, address = $7, notes = $8
        WHERE id = $9
      `, [name, grade, roll_number, dob, parent_name, parent_contact, address, notes, req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Staff
  app.get("/api/staff", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM staff ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/staff", async (req, res) => {
    const { name, role, email, phone } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO staff (name, role, email, phone) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, role, email, phone]
      );
      res.json({ id: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.put("/api/staff/:id", async (req, res) => {
    const { id } = req.params;
    const { name, role, email, phone } = req.body;
    try {
      await pool.query(
        "UPDATE staff SET name = $1, role = $2, email = $3, phone = $4 WHERE id = $5",
        [name, role, email, phone, id]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Attendance
  app.get("/api/attendance", async (req, res) => {
    const { date, type } = req.query;
    try {
      const result = await pool.query(
        "SELECT * FROM attendance WHERE date = $1 AND type = $2",
        [date, type]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/attendance", async (req, res) => {
    const { person_id, type, date, status } = req.body;
    try {
      await pool.query(`
        INSERT INTO attendance (person_id, type, date, status) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT(person_id, type, date) DO UPDATE SET status = EXCLUDED.status
      `, [person_id, type, date, status]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM activities ORDER BY date DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/activities", async (req, res) => {
    const { title, description, date, time, location } = req.body;
    try {
      await pool.query(
        "INSERT INTO activities (title, description, date, time, location) VALUES ($1, $2, $3, $4, $5)",
        [title, description, date, time, location]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Results
  app.get("/api/results/:studentId", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM results WHERE student_id = $1", [req.params.studentId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/results", async (req, res) => {
    const { student_id, subject, marks, term } = req.body;
    try {
      await pool.query(
        "INSERT INTO results (student_id, subject, marks, term) VALUES ($1, $2, $3, $4)",
        [student_id, subject, marks, term]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Quizzes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM quizzes ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/quizzes", async (req, res) => {
    const { title, questions } = req.body;
    try {
      await pool.query(
        "INSERT INTO quizzes (title, questions) VALUES ($1, $2)",
        [title, JSON.stringify(questions)]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM testimonials ORDER BY date DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/testimonials", async (req, res) => {
    const { author, content, rating } = req.body;
    try {
      await pool.query(
        "INSERT INTO testimonials (author, content, rating) VALUES ($1, $2, $3)",
        [author, content, rating || 5]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.put("/api/testimonials/:id", async (req, res) => {
    const { author, content, rating } = req.body;
    try {
      await pool.query(
        "UPDATE testimonials SET author = $1, content = $2, rating = $3 WHERE id = $4",
        [author, content, rating || 5, req.params.id]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Admissions
  app.get("/api/admissions", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM admissions ORDER BY applied_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/admissions", async (req, res) => {
    const { student_name, grade_applied, parent_name, parent_contact, address } = req.body;
    try {
      await pool.query(
        "INSERT INTO admissions (student_name, grade_applied, parent_name, parent_contact, address) VALUES ($1, $2, $3, $4, $5)",
        [student_name, grade_applied, parent_name, parent_contact, address]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });
  
  app.post("/api/notifications", async (req, res) => {
    const { title, message, type, broadcast } = req.body;
    try {
      await pool.query(
        "INSERT INTO notifications (title, message, type, broadcast) VALUES ($1, $2, $3, $4)",
        [title, message, type, broadcast ? 1 : 0]
      );
      
      if (broadcast) {
        const staffRes = await pool.query("SELECT email, phone, name FROM staff");
        const studentRes = await pool.query("SELECT parent_contact, name FROM students");
        
        const staff = staffRes.rows;
        const students = studentRes.rows;
        
        console.log(`[BROADCAST] Sending notification "${title}" to ${staff.length} staff and ${students.length} parents.`);
        
        staff.forEach(member => {
          if (member.email) console.log(`[EMAIL] To: ${member.email} (${member.name}) - Subject: ${title}`);
          if (member.phone) console.log(`[SMS] To: ${member.phone} (${member.name}) - Message: ${title}: ${message}`);
        });

        students.forEach(student => {
          if (student.parent_contact) console.log(`[SMS] To: ${student.parent_contact} (Parent of ${student.name}) - Message: ${title}: ${message}`);
        });
        
        return res.json({ success: true, broadcastCount: staff.length + students.length });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Stats for Dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const studentCount = await pool.query("SELECT COUNT(*) as count FROM students");
      const staffCount = await pool.query("SELECT COUNT(*) as count FROM staff");
      const activityCount = await pool.query("SELECT COUNT(*) as count FROM activities");
      const pendingAdmissions = await pool.query("SELECT COUNT(*) as count FROM admissions WHERE status = 'pending'");
      const recentNotifications = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 3");
      const recentAdmissions = await pool.query("SELECT * FROM admissions ORDER BY applied_at DESC LIMIT 3");
      
      res.json({
        students: parseInt(studentCount.rows[0].count),
        staff: parseInt(staffCount.rows[0].count),
        activities: parseInt(activityCount.rows[0].count),
        pendingAdmissions: parseInt(pendingAdmissions.rows[0].count),
        recentNotifications: recentNotifications.rows,
        recentAdmissions: recentAdmissions.rows
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
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
