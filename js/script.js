const studentList = document.querySelector("#student-list");
const defaultImage = "https://placehold.co/200x250?text=No+Image";

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => res.json())
  .then((data) => {
    renderStudents(data);
  })
  .catch((err) => console.error(err));

function renderStudents(students) {
  studentList.innerHTML = "";

  students.forEach((student) => {
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

    saveBtn.addEventListener("click", () => {
      console.log("Saved:", student.name);
    });

    deleteBtn.addEventListener("click", () => {
      card.remove();
    });

    studentList.append(card);
  });
}
