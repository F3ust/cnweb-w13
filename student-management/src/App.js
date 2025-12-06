import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', stuClass: '' });
  
  // State tracking: null = Add Mode, string (ID) = Edit Mode
  const [editingId, setEditingId] = useState(null);

  // Constants
  const API_URL = 'http://localhost:5001/api/students';

  // [READ] Init: Fetch data when component mounts
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setStudents(res.data);
        console.log("[INFO] Data fetched successfully");
      })
      .catch(err => console.error("[ERROR] Fetch failed:", err));
  }, []);

  // Handler: Input change (Controlled Component)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Action: Populate form for Editing
   */
  const startEditing = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      age: student.age,
      stuClass: student.class // Map DB 'class' -> Form 'stuClass'
    });
  };

  /**
   * Action: Reset Form & Exit Edit Mode
   */
  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', stuClass: '' });
  };

  /**
   * [CREATE] & [UPDATE] Handler
   * Logic: Check 'editingId' to decide POST or PUT
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare Payload (Ensure types match DB Schema)
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      class: formData.stuClass
    };

    try {
      if (editingId) {
        // --- UPDATE FLOW (PUT) ---
        const res = await axios.put(`${API_URL}/${editingId}`, payload);
        
        // Optimistic Update: Modify item in local state
        setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
        console.log("[INFO] Student updated:", res.data);
        
        resetForm();
      } else {
        // --- CREATE FLOW (POST) ---
        const res = await axios.post(API_URL, payload);
        
        // Optimistic Update: Append new item
        setStudents(prev => [...prev, res.data]);
        console.log("[INFO] Student added:", res.data);
        
        resetForm();
      }
    } catch (err) {
      console.error("[ERROR] Submit failed:", err);
      alert("Lỗi: Kiểm tra Console để biết chi tiết.");
    }
  };

  /**
   * [DELETE] Handler
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này không?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      
      // Update UI: Filter out deleted item
      setStudents(prev => prev.filter(s => s._id !== id));
      console.log(`[INFO] Deleted ID: ${id}`);
    } catch (err) {
      console.error("[ERROR] Delete failed:", err);
      alert("Không thể xóa. Kiểm tra Console.");
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>

      {/* --- FORM SECTION --- */}
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
        
        {/* Dynamic Buttons based on Mode */}
        {editingId ? (
          <>
            <button type="submit" className="btn-update">Cập nhật</button>
            <button type="button" className="btn-cancel" onClick={resetForm}>Hủy</button>
          </>
        ) : (
          <button type="submit">Thêm mới</button>
        )}
      </form>

      {/* --- TABLE SECTION --- */}
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
          {students.length > 0 ? (
            students.map((s) => (
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
                Chưa có dữ liệu hiển thị
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;