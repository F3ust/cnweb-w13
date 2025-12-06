const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("error connect MongoDB:", err));

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});