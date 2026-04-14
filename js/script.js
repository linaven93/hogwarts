console.log("App started");

fetch("https://hp-api.onrender.com/api/characters/students")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    data.forEach((student) => {
      console.log(student.name);
    });
  })
  .catch((err) => console.error(err));
