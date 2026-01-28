// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/student_db';

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));

// GET all students
app.get('/api/students', async (req, res) => {
    try {
        console.log('📖 Nhận yêu cầu lấy danh sách học sinh');
        const students = await Student.find();
        console.log(`✅ Tìm thấy ${students.length} học sinh`);
        res.json(students);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET student by id
app.get('/api/students/:id', async (req, res) => {
    try {
        const s = await Student.findById(req.params.id);
        if (!s) return res.status(404).json({ error: 'Student not found' });
        res.json(s);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Create new student
app.post('/api/students', async (req, res) => {
    try {
        console.log('📝 Nhận yêu cầu thêm học sinh:', req.body);
        const newStudent = await Student.create(req.body);
        console.log('✅ Thêm thành công:', newStudent);
        res.status(201).json(newStudent);
    } catch (err) {
        console.error('❌ Lỗi khi thêm:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// PUT - Update student by id
app.put('/api/students/:id', async (req, res) => {
    try {
        console.log('✏️ Nhận yêu cầu cập nhật học sinh ID:', req.params.id, 'Dữ liệu:', req.body);
        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStu) {
            console.error('❌ Không tìm thấy học sinh ID:', req.params.id);
            return res.status(404).json({ error: "Student not found" });
        }
        console.log('✅ Cập nhật thành công:', updatedStu);
        res.json(updatedStu);
    } catch (err) {
        console.error('❌ Lỗi khi cập nhật:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Delete student by id
app.delete('/api/students/:id', async (req, res) => {
    try {
        console.log('🗑️ Nhận yêu cầu xóa học sinh ID:', req.params.id);
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) {
            console.error('❌ Không tìm thấy học sinh ID:', req.params.id);
            return res.status(404).json({ error: "Student not found" });
        }
        console.log('✅ Xóa thành công học sinh:', deleted.name);
        res.json({ message: "Đã xóa học sinh", id: deleted._id, name: deleted.name });
    } catch (err) {
        console.error('❌ Lỗi khi xóa:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));