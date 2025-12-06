import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State management
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', stuClass: '' });
  const [editingId, setEditingId] = useState(null);
  
  // Search & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const API_URL = 'http://localhost:5001/api/students';

  // Fetch initial data
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setStudents(res.data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // Computed: Filter by Search Term -> Then Sort by Name
  const displayedStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Use localeCompare for correct Vietnamese string comparison
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Toggle sort order
  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (student) => {
    setEditingId(student._id);
    setFormData({ name: student.name, age: student.age, stuClass: student.class });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', stuClass: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      class: formData.stuClass
    };

    try {
      if (editingId) {
        const res = await axios.put(`${API_URL}/${editingId}`, payload);
        setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
        resetForm();
      } else {
        const res = await axios.post(API_URL, payload);
        setStudents(prev => [...prev, res.data]);
        resetForm();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error processing request.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting record.");
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>

      {/* Input Form */}
      <form className="student-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={{ flex: 2 }}
        />
        <input
          type="number"
          name="age"
          placeholder="Tuổi"
          value={formData.age}
          onChange={handleInputChange}
          required
          style={{ flex: 1 }}
        />
        <input
          type="text"
          name="stuClass"
          placeholder="Lớp"
          value={formData.stuClass}
          onChange={handleInputChange}
          required
          style={{ flex: 1 }}
        />
        
        {editingId ? (
          <>
            <button type="submit" className="btn-update">Cập nhật</button>
            <button type="button" className="btn-cancel" onClick={resetForm}>Hủy</button>
          </>
        ) : (
          <button type="submit">Thêm mới</button>
        )}
      </form>

      {/* Toolbar: Search + Sort */}
      <div className="toolbar-container">
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <button type="button" onClick={handleSortToggle} className="btn-sort">
          Sắp xếp: {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
        </button>
      </div>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th onClick={handleSortToggle} style={{ cursor: 'pointer', userSelect: 'none' }}>
              Họ Tên {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th style={{ width: "140px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {displayedStudents.length > 0 ? (
            displayedStudents.map((s) => (
              <tr key={s._id} className={editingId === s._id ? 'editing-row' : ''}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.class}</td>
                <td>
                  <button 
                    className="btn-icon" 
                    onClick={() => startEditing(s)}
                    disabled={editingId === s._id}
                    style={{ marginRight: '8px' }}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(s._id)}
                    disabled={editingId === s._id}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#5f6368" }}>
                {searchTerm ? "Không tìm thấy kết quả" : "Chưa có dữ liệu hiển thị"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;