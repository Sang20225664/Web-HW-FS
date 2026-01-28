# 📚 Ứng Dụng Quản Lý Học Sinh - MERN Stack

Ứng dụng web quản lý học sinh với đầy đủ chức năng CRUD (Create, Read, Update, Delete), tìm kiếm, và sắp xếp.

## 🎯 Tính Năng

- ✅ **Xem danh sách** học sinh
- ✅ **Thêm** học sinh mới
- ✅ **Chỉnh sửa** thông tin học sinh
- ✅ **Xóa** học sinh (với xác nhận)
- ✅ **Tìm kiếm** học sinh theo tên (real-time)
- ✅ **Sắp xếp** danh sách (A→Z hoặc Z→A)

## 🏗️ Cấu trúc dự án

```
student-management/
├── backend/                      # Backend Express + MongoDB
│   ├── models/
│   │   └── Student.js           # Mongoose schema
│   ├── index.js                 # Server chính (API endpoints)
│   ├── docker-compose.yml       # MongoDB container config
│   ├── package.json
│   └── node_modules/
│
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── App.js              # Router chính
│   │   ├── HomePage.js         # Trang danh sách + thêm
│   │   ├── EditStudent.js      # Trang chỉnh sửa
│   │   ├── HomePage.css
│   │   ├── EditStudent.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── node_modules/
│
└── README.md                   # File này

```

## 🚀 Hướng dẫn chạy ứng dụng

### Điều kiện tiên quyết
- Node.js và npm (phiên bản mới)
- Docker (để chạy MongoDB)
- Git

### 1. Khởi động MongoDB

```bash
cd backend
docker-compose up -d
docker ps  # Kiểm tra container đang chạy
```

**Kết quả mong đợi**: Container `student-mongo` chạy trên port 27017

### 2. Chạy Backend

**Terminal 1:**
```bash
cd backend
npm install     # Chạy lần đầu
npm start       # Hoặc: npm run dev (nếu dùng nodemon)
```

**Kết quả mong đợi**:
```
Server running on http://localhost:5000
MongoDB connected
```

### 3. Chạy Frontend

**Terminal 2:**
```bash
cd frontend
npm install     # Chạy lần đầu
npm start
```

**Kết quả**: Trình duyệt tự động mở http://localhost:3000

## 📡 API Endpoints

| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| GET | `/api/health` | Kiểm tra server |
| GET | `/api/students` | Lấy danh sách tất cả học sinh |
| GET | `/api/students/:id` | Lấy chi tiết một học sinh |
| POST | `/api/students` | Thêm học sinh mới |
| PUT | `/api/students/:id` | Cập nhật thông tin học sinh |
| DELETE | `/api/students/:id` | Xóa học sinh |

## 🔍 Kiểm tra Endpoints với cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Lấy danh sách
curl http://localhost:5000/api/students

# Thêm học sinh
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn A","age":18,"class":"10A"}'

# Cập nhật
curl -X PUT http://localhost:5000/api/students/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn B","age":19,"class":"10B"}'

# Xóa
curl -X DELETE http://localhost:5000/api/students/<id>
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Express.js** - Web framework
- **Mongoose** - ODM cho MongoDB
- **CORS** - Cross-Origin Resource Sharing
- **Node.js** - JavaScript runtime

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

### Database
- **MongoDB** - NoSQL database
- **Docker** - Container

## 📊 Model Dữ Liệu

**Student Schema:**
```javascript
{
  name: String (required),    // Họ và tên
  age: Number (required),     // Tuổi
  class: String (required),   // Lớp
  createdAt: Date,            // Ngày tạo
  updatedAt: Date             // Ngày cập nhật
}
```

## 🐛 Xử lý sự cố

### Backend không kết nối MongoDB
```bash
# Kiểm tra container MongoDB
docker ps

# Nếu không chạy, khởi động lại
docker-compose up -d

# Kiểm tra logs
docker logs student-mongo
```

### Port 5000 đang được sử dụng
```bash
# Dừng process trên port 5000
lsof -i :5000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

### Frontend không kết nối Backend
1. Kiểm tra backend đang chạy: `http://localhost:5000/api/health`
2. Kiểm tra CORS được bật trên backend
3. Kiểm tra Network tab trong DevTools (F12)

## 📚 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Router Documentation](https://reactrouter.com/)

