const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student'); 

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json()); 

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