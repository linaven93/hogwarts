const studentList = document.querySelector("#student-list");
const searchInput = document.querySelector("#search");
const savedList = document.querySelector("#saved-list");
const saveMessage = document.querySelector("#save-message");

const defaultImage = "https://placehold.co/200x250?text=No+Image";

let students = [];
let savedStudents = JSON.parse(localStorage.getItem("savedStudents")) || [];

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => res.json())
  .then((data) => {
    students = data;
    renderStudents(students);
    renderSavedStudents();
  })
  .catch((err) => console.error("Error fetching students:", err));

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(value) ||
      student.house.toLowerCase().includes(value)
    );
  });

  renderStudents(filtered);
});

function getHouseColor(house) {
  if (house === "Gryffindor") {
    return "#ba0d18";
  } else if (house === "Slytherin") {
    return "#194b35";
  } else if (house === "Ravenclaw") {
    return "#28528c";
  } else if (house === "Hufflepuff") {
    return "#f5b940";
  } else {
    return "#d2caca";
  }
}

function renderStudents(list) {
  studentList.innerHTML = "";

  if (list.length === 0) {
    studentList.innerHTML = "<p>No students found</p>";
    return;
  }

  list.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.style.backgroundColor = getHouseColor(student.house);

    const image = student.image ? student.image : defaultImage;

    const altNames =
      student.alternate_names && student.alternate_names.length > 0
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
      const alreadySaved = savedStudents.some(
        (item) => item.name === student.name,
      );

      if (alreadySaved) {
        savedStudents = savedStudents.filter(
          (item) => item.name !== student.name,
        );
        saveBtn.textContent = "Save";
        saveMessage.textContent = "";
      } else {
        if (savedStudents.length >= 3) {
          saveMessage.textContent = "You can only save up to 3 students.";
          return;
        }

        savedStudents.push(student);
        saveBtn.textContent = "Saved";
        saveMessage.textContent = "";
      }

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));
      renderSavedStudents();
    });

    deleteBtn.addEventListener("click", () => {
      students = students.filter((item) => item.name !== student.name);
      savedStudents = savedStudents.filter(
        (item) => item.name !== student.name,
      );

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));

      renderStudents(students);
      renderSavedStudents();
    });

    studentList.append(card);
  });
}

function renderSavedStudents() {
  savedList.innerHTML = "";

  if (savedStudents.length === 0) {
    savedList.innerHTML = "<p>No saved students yet</p>";
    return;
  }

  savedStudents.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.style.backgroundColor = getHouseColor(student.house);

    const image = student.image ? student.image : defaultImage;

    card.innerHTML = `
      <img src="${image}" alt="${student.name}">
      <h3>${student.name}</h3>
      <p>House: ${student.house || "Unknown"}</p>
      <button class="remove-btn">Remove</button>
    `;

    const removeBtn = card.querySelector(".remove-btn");

    removeBtn.addEventListener("click", () => {
      savedStudents = savedStudents.filter(
        (item) => item.name !== student.name,
      );

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));

      saveMessage.textContent = "";
      renderSavedStudents();
      renderStudents(students);
    });

    savedList.append(card);
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
