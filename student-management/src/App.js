import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', stuClass: '' });
  
  // State to track editing mode (null = add mode, string = edit mode)
  const [editingId, setEditingId] = useState(null);

  // Init: Fetch data
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => {
        setStudents(res.data);
        console.log("[INFO] Data fetched successfully");
      })
      .catch(err => console.error("[ERROR] Fetch failed:", err));
  }, []);

  // Handler: Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Action: Populate form with selected student data
   * Switch to Edit Mode
   */
  const startEditing = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      age: student.age,
      stuClass: student.class
    });
    // Optional: Focus back to input for better UX
    document.querySelector('input[name="name"]').focus();
  };

  /**
   * Action: Cancel editing
   * Reset form & mode
   */
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', stuClass: '' });
  };

  // Handler: Submit form (Decide Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      class: formData.stuClass
    };

    try {
      if (editingId) {
        // --- UPDATE FLOW ---
        const res = await axios.put(`http://localhost:5001/api/students/${editingId}`, payload);
        console.log("[INFO] Student updated:", res.data);

        // Update local list without refetching
        setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
        
        // Reset mode
        cancelEditing();
      } else {
        // --- CREATE FLOW ---
        const res = await axios.post('http://localhost:5001/api/students', payload);
        console.log("[INFO] Student added:", res.data);
        setStudents(prev => [...prev, res.data]);
        setFormData({ name: '', age: '', stuClass: '' });
      }
    } catch (err) {
      console.error("[ERROR] Submit failed:", err);
      alert("Error: Check console for details.");
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>

      {/* Input Form (Reusable for both Add & Edit) */}
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
        
        {/* Dynamic Buttons */}
        {editingId ? (
          <>
            <button type="submit" className="btn-update">Cập nhật</button>
            <button type="button" className="btn-cancel" onClick={cancelEditing}>Hủy</button>
          </>
        ) : (
          <button type="submit">Thêm mới</button>
        )}
      </form>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className={editingId === s._id ? 'editing-row' : ''}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.class}</td>
              <td>
                <button 
                  className="btn-icon" 
                  onClick={() => startEditing(s)}
                  disabled={editingId === s._id} // Disable if currently editing this row
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;