import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  }, []);

  return (
    <div className="App">
      <h1>Danh sách học sinh</h1>
      <table border="1" style={{ margin: "0 auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Chưa có học sinh nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;