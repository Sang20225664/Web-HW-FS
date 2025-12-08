import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    // Form states
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [stuClass, setStuClass] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/students');
            setStudents(response.data);
            setError(null);
        } catch (error) {
            console.error("Lỗi khi fetch danh sách:", error);
            setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = (e) => {
        e.preventDefault();

        // Validate input
        if (!name.trim() || !age || !stuClass.trim()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const newStudent = {
            name: name.trim(),
            age: Number(age),
            class: stuClass.trim()
        };

        axios.post('http://localhost:5000/api/students', newStudent)
            .then(res => {
                console.log("Đã thêm:", res.data);
                // Thêm học sinh mới vào danh sách
                setStudents(prev => [...prev, res.data]);
                // Xóa form
                setName('');
                setAge('');
                setStuClass('');
                // Hiển thị thông báo thành công
                setSuccessMessage('✅ Thêm học sinh thành công!');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch(err => {
                console.error("Lỗi khi thêm:", err);
                alert('Lỗi khi thêm học sinh: ' + (err.response?.data?.error || err.message));
            });
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa học sinh "${name}"?`)) {
            return;
        }

        axios.delete(`http://localhost:5000/api/students/${id}`)
            .then(res => {
                console.log("Đã xóa:", res.data.message);
                // Xóa khỏi danh sách
                setStudents(prevList => prevList.filter(s => s._id !== id));
                // Hiển thị thông báo thành công
                setSuccessMessage('✅ Xóa học sinh thành công!');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch(err => {
                console.error("Lỗi khi xóa:", err);
                alert('Lỗi khi xóa học sinh: ' + (err.response?.data?.error || err.message));
            });
    };

    // Lọc danh sách học sinh dựa trên từ khóa tìm kiếm
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sắp xếp danh sách học sinh theo tên
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortAsc ? -1 : 1;
        if (nameA > nameB) return sortAsc ? 1 : -1;
        return 0;
    });

    return (
        <div className="HomePage">
            <header className="page-header">
                <h1>Quản Lý Học Sinh</h1>
            </header>

            <div className="container">
                {/* Form thêm học sinh */}
                <div className="form-section">
                    <h2>Thêm Học Sinh Mới</h2>
                    {successMessage && <p className="success">{successMessage}</p>}
                    <form onSubmit={handleAddStudent} className="add-student-form">
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Tuổi"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            min="1"
                            max="100"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Lớp"
                            value={stuClass}
                            onChange={e => setStuClass(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-add">Thêm Học Sinh</button>
                    </form>
                </div>

                {/* Danh sách học sinh */}
                <div className="list-section">
                    <div className="list-header">
                        <h2>Danh sách học sinh</h2>
                        <button
                            className="btn-sort"
                            onClick={() => setSortAsc(prev => !prev)}
                            title="Nhấn để đảo thứ tự sắp xếp"
                        >
                            {sortAsc ? 'A → Z' : 'Z → A'}
                        </button>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {loading && <p>Đang tải dữ liệu...</p>}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && students.length === 0 && (
                        <p className="no-data">Chưa có học sinh nào trong danh sách.</p>
                    )}

                    {!loading && !error && students.length > 0 && filteredStudents.length === 0 && (
                        <p className="no-data">Không tìm thấy học sinh nào phù hợp với từ khóa "{searchTerm}".</p>
                    )}

                    {!loading && !error && filteredStudents.length > 0 && (
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Tuổi</th>
                                    <th>Lớp</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStudents.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>{student.class}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(student._id)}
                                            >
                                                ✏️ Sửa
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(student._id, student.name)}
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
