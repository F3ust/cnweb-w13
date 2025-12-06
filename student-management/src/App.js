import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State management
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', stuClass: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = 'http://localhost:5001/api/students';

  // Fetch initial data on component mount
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setStudents(res.data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // Filter students based on search term (Client-side)
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update form state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Switch to edit mode and populate form
  const startEditing = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      age: student.age,
      stuClass: student.class
    });
  };

  // Reset form to default add mode
  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', stuClass: '' });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      class: formData.stuClass
    };

    try {
      if (editingId) {
        // Update existing record
        const res = await axios.put(`${API_URL}/${editingId}`, payload);
        setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
        resetForm();
      } else {
        // Create new record
        const res = await axios.post(API_URL, payload);
        setStudents(prev => [...prev, res.data]);
        resetForm();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error processing request.");
    }
  };

  // Handle delete operation with confirmation
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

      {/* Input Form Section */}
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

      {/* Search Section */}
      <div style={{ marginBottom: '16px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '4px', 
            border: '1px solid #dadce0',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Data Table Section */}
      <table>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th style={{ width: "140px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
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