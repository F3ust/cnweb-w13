const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student'); 

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
    console.log("[DEBUG] Method:", req.method);
    console.log("[DEBUG] Content-Type:", req.headers['content-type']);
    console.log("[DEBUG] Body:", req.body);
    next();
});

/**
 * [POST] /api/students
 * Create new student record
 */
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        console.log(`[INFO] New student created: ${newStudent.name}`);
        res.status(201).json(newStudent);
    } catch (e) {
        console.error("[ERROR] Failed to create student:", e.message); 
        res.status(400).json({ error: e.message });
    }
});

/**
 * [PUT] /api/students/:id
 * Update student info by ID
 * Returns: Updated document (due to { new: true })
 */
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find ID & Update. { new: true } returns the modified doc, not original
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        console.log(`[INFO] Student updated: ${updatedStudent.name}`);
        res.json(updatedStudent);
    } catch (e) {
        console.error("[ERROR] Update failed:", e.message);
        res.status(400).json({ error: e.message });
    }
});

/**
 * [DELETE] /api/students/:id
 * Description: Hard delete record by ID
 */
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Student.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Student not found" });
        }

        console.log(`[INFO] Deleted student ID: ${id}`);
        res.json({ message: "Delete success", id });
    } catch (e) {
        console.error("[ERROR] Delete failed:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// Kết nối MongoDB 
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Connect to MongoDB Successfully"))
    .catch(err => console.error("Error connect MongoDB:", err));

// API GET: Lấy danh sách học sinh
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});