import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', stuClass: '' });

  // Init: Fetch data
  useEffect(() => {
    axios.get('http://localhost:5001/api/students')
      .then(res => {
        setStudents(res.data);
        console.log("[INFO] Data fetched successfully"); // Log English
      })
      .catch(err => console.error("[ERROR] Fetch failed:", err));
  }, []);

  // Handler: Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler: Submit form
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        age: Number(formData.age),
        class: formData.stuClass
      };

      const res = await axios.post('http://localhost:5001/api/students', payload);
      
      console.log("[INFO] Student added:", res.data); // Log English
      
      // Update UI & Reset form
      setStudents(prev => [...prev, res.data]);
      setFormData({ name: '', age: '', stuClass: '' });
      
    } catch (err) {
      console.error("[ERROR] Add student failed:", err);
      alert("Error: Check console for details.");
    }
  };

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>

      {/* Input Form */}
      <form className="student-form" onSubmit={handleAddStudent}>
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
        <button type="submit">Thêm mới</button>
      </form>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.class}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "#5f6368" }}>
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