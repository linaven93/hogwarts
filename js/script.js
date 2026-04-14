const studentList = document.querySelector("#student-list");

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => res.json())
  .then((data) => {
    renderStudents(data);
  })
  .catch((err) => console.error(err));

function renderStudents(students) {
  studentList.innerHTML = "";

  students.forEach((student) => {
    const p = document.createElement("p");
    p.textContent = student.name;
    studentList.append(p);
  });
}
