const studentList = document.querySelector("#student-list");
const searchInput = document.getElementById("search");
const defaultImage = "https://placehold.co/200x250?text=No+Image";

let students = [];
let savedStudents = JSON.parse(localStorage.getItem("savedStudents")) || [];

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => res.json())
  .then((data) => {
    students = data;
    renderStudents(students);
  })
  .catch((err) => console.error(err));

searchInput.addEventListener("input", function () {
  const value = searchInput.value.toLowerCase();

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(value) ||
      student.house.toLowerCase().includes(value),
  );

  renderStudents(filtered);
});

function renderStudents(list) {
  studentList.innerHTML = "";

  if (list.length === 0) {
    studentList.innerHTML = "<p>No students found</p>";
    return;
  }

  list.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("student-card");

    const image = student.image ? student.image : defaultImage;

    const altNames =
      student.alternate_names.length > 0
        ? student.alternate_names.join(", ")
        : "None";

    const wand =
      student.wand &&
      (student.wand.wood || student.wand.core || student.wand.length)
        ? `${student.wand.wood || "Unknown"}, ${student.wand.core || "Unknown"}, ${student.wand.length || "Unknown"}`
        : "Unknown";

    const age = student.yearOfBirth ? 2026 - student.yearOfBirth : "Unknown";

    card.innerHTML = `
      <img src="${image}" alt="${student.name}">
      <h2>${student.name}</h2>
      <p>Alternative names: ${altNames}</p>
      <p>Age: ${age}</p>
      <p>Wand: ${wand}</p>
      <p>House: ${student.house || "Unknown"}</p>
      <button class="save-btn">Save</button>
      <button class="delete-btn">Delete</button>
    `;

    const saveBtn = card.querySelector(".save-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    const isSaved = savedStudents.some((item) => item.name === student.name);
    if (isSaved) {
      saveBtn.textContent = "Saved";
    }

    saveBtn.addEventListener("click", () => {
      const isSaved = savedStudents.some((item) => item.name === student.name);

      if (isSaved) {
        savedStudents = savedStudents.filter(
          (item) => item.name !== student.name,
        );
        saveBtn.textContent = "Save";
        saveBtn.disabled = false;
      } else {
        savedStudents.push(student);
        saveBtn.textContent = "Saved";
      }

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));
    });

    deleteBtn.addEventListener("click", () => {
      students = students.filter((item) => item.name !== student.name);
      savedStudents = savedStudents.filter(
        (item) => item.name !== student.name,
      );
      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));
      renderStudents(students);
    });

    studentList.append(card);
  });
}
function filterByHouse(house) {
  if (house === "all") {
    renderStudents(students);
    return;
  }

  const filtered = students.filter((student) => student.house === house);

  renderStudents(filtered);
}
