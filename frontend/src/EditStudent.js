import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditStudent.css';

function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/students/${id}`);
            setName(response.data.name);
            setAge(response.data.age);
            setStuClass(response.data.class);
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            setError('Không thể tải thông tin học sinh. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        // Validate input
        if (!name.trim() || !age || !stuClass.trim()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const updatedData = {
            name: name.trim(),
            age: Number(age),
            class: stuClass.trim()
        };

        axios.put(`http://localhost:5000/api/students/${id}`, updatedData)
            .then(res => {
                console.log("Đã cập nhật:", res.data);
                alert('✅ Cập nhật thành công!');
                navigate('/');
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật:", err);
                alert('Lỗi khi cập nhật: ' + (err.response?.data?.error || err.message));
            });
    };

    const handleCancel = () => {
        navigate('/');
    };

    if (loading) return <div className="edit-container"><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className="edit-container"><p className="error">{error}</p></div>;

    return (
        <div className="EditStudent">
            <header className="page-header">
                <h1>Quản Lý Học Sinh</h1>
            </header>

            <div className="edit-container">
                <div className="edit-form-section">
                    <h2>✏️ Sửa Thông Tin Học Sinh</h2>

                    <form onSubmit={handleUpdate} className="edit-form">
                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tuổi *</label>
                            <input
                                type="number"
                                placeholder="Nhập tuổi"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                min="1"
                                max="100"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Lớp *</label>
                            <input
                                type="text"
                                placeholder="Nhập lớp"
                                value={stuClass}
                                onChange={e => setStuClass(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">💾 Lưu Thay Đổi</button>
                            <button type="button" className="btn-cancel" onClick={handleCancel}>❌ Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditStudent;
