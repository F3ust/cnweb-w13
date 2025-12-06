const mongoose = require('mongoose');
const Student = require('./Student'); 

// Dữ liệu mẫu
const sampleData = [
  { name: "Nguyễn Văn An", age: 20, class: "CNTT-K64" },
  { name: "Trần Thị Bình", age: 21, class: "KT-K63" },
  { name: "Lê Hoàng Cường", age: 19, class: "DTVT-K65" },
  { name: "Phạm Minh Dũng", age: 22, class: "CNTT-K62" },
  { name: "Hoàng Ngọc Em", age: 20, class: "ANM-K64" },
  { name: "Vũ Thu Giang", age: 18, class: "QTKD-K66" },
  { name: "Nguyễn Thành Hưng", age: 23, class: "CNTT-K61" },
  { name: "Đặng Thùy Linh", age: 20, class: "KT-K64" },
  { name: "Bùi Văn Nam", age: 21, class: "DTVT-K63" },
  { name: "Nguyễn Thị Lan", age: 19, class: "CNTT-K65" }
];

// Kết nối và nạp dữ liệu
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(async () => {
    console.log("connecting...");
    
    await Student.insertMany(sampleData);
    console.log("Complete");
    
    process.exit(); // Thoát script sau khi xong
  })
  .catch(err => {
    console.error("ERROR", err);
    process.exit(1);
  });