const studentList = document.querySelector("#student-list");
const searchInput = document.querySelector("#search");
const savedList = document.querySelector("#saved-list");
const saveMessage = document.querySelector("#save-message");
const addStudentForm = document.querySelector("#add-student-form");
const nameInput = document.querySelector("#name");
const houseInput = document.querySelector("#house");
const yearInput = document.querySelector("#yearOfBirth");
const imageInput = document.querySelector("#image");
const wandWoodInput = document.querySelector("#wandWood");
const wandCoreInput = document.querySelector("#wandCore");
const wandLengthInput = document.querySelector("#wandLength");

const defaultImage = "https://placehold.co/200x250?text=No+Image";

let students = [];
let savedStudents = JSON.parse(localStorage.getItem("savedStudents")) || [];
let customStudents = JSON.parse(localStorage.getItem("customStudents")) || [];
let currentFilter = "all";
let currentSort = null;

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch students");
    }
    return res.json();
  })
  .then((data) => {
    students = [...customStudents, ...data];
    renderStudents(students);
    renderSavedStudents();
  })
  .catch((err) => {
    console.error("Error fetching students:", err);
    studentList.innerHTML =
      "<p>Error loading students. Please try again later.</p>";
  });

searchInput.addEventListener("input", () => {
  applyFiltersAndSort();
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

function sortByAge(order) {
  currentSort = order;
  applyFiltersAndSort();
}

function applyFiltersAndSort() {
  let result = [...students];
  const searchValue = searchInput.value.toLowerCase();

  if (currentFilter !== "all") {
    result = result.filter((student) => student.house === currentFilter);
  }

  if (searchValue) {
    result = result.filter((student) => {
      return (
        (student.name || "").toLowerCase().includes(searchValue) ||
        (student.house || "").toLowerCase().includes(searchValue)
      );
    });
  }

  if (currentSort) {
    result.sort((a, b) => {
      const ageA = a.yearOfBirth ? 2026 - a.yearOfBirth : 0;
      const ageB = b.yearOfBirth ? 2026 - b.yearOfBirth : 0;

      if (currentSort === "youngest") {
        return ageA - ageB;
      } else {
        return ageB - ageA;
      }
    });
  }

  renderStudents(result);
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
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    const saveBtn = card.querySelector(".save-btn");
    const deleteBtn = card.querySelector(".delete-btn");
    const editBtn = card.querySelector(".edit-btn");

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

    editBtn.addEventListener("click", () => {
      const oldName = student.name;

      const newName = prompt("Enter new name:", student.name);
      const newHouse = prompt("Enter new house:", student.house || "");
      const newYear = prompt(
        "Enter new year of birth:",
        student.yearOfBirth || "",
      );

      if (newName === null || newHouse === null || newYear === null) {
        return;
      }

      student.name = newName.trim() || student.name;
      student.house = newHouse.trim() || student.house;
      student.yearOfBirth = newYear ? Number(newYear) : null;

      savedStudents = savedStudents.map((item) => {
        if (item.name === oldName) {
          return { ...item, ...student };
        }
        return item;
      });

      customStudents = customStudents.map((item) => {
        if (item.name === oldName) {
          return { ...item, ...student };
        }
        return item;
      });

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));
      localStorage.setItem("customStudents", JSON.stringify(customStudents));

      applyFiltersAndSort();
      renderSavedStudents();
    });

    deleteBtn.addEventListener("click", () => {
      students = students.filter((item) => item.name !== student.name);
      savedStudents = savedStudents.filter(
        (item) => item.name !== student.name,
      );
      customStudents = customStudents.filter(
        (item) => item.name !== student.name,
      );

      localStorage.setItem("savedStudents", JSON.stringify(savedStudents));
      localStorage.setItem("customStudents", JSON.stringify(customStudents));

      applyFiltersAndSort();
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
      applyFiltersAndSort();
    });

    savedList.append(card);
  });
}

function filterByHouse(house) {
  currentFilter = house;
  applyFiltersAndSort();
}

addStudentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newStudent = {
    name: nameInput.value.trim(),
    house: houseInput.value.trim(),
    yearOfBirth: yearInput.value ? Number(yearInput.value) : null,
    image: imageInput.value.trim() || defaultImage,
    alternate_names: [],
    wand: {
      wood: wandWoodInput.value.trim(),
      core: wandCoreInput.value.trim(),
      length: wandLengthInput.value ? Number(wandLengthInput.value) : "",
    },
  };

  if (!newStudent.name || !newStudent.house) {
    saveMessage.textContent = "Name and house are required.";
    return;
  }

  students.unshift(newStudent);
  customStudents.push(newStudent);

  localStorage.setItem("customStudents", JSON.stringify(customStudents));
  applyFiltersAndSort();

  saveMessage.textContent = "";
  addStudentForm.reset();
});
