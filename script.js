const taskData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const modal = document.querySelector(".modal");
const toggleModalBtn = document.querySelector("#toggle-modal");
const bg = document.querySelector(".bg");
const addBtn = document.querySelector("#add-new-task");
const taskInput = document.querySelector("#taskTitle");
const taskText = document.querySelector("#taskDesc");
const columns = [todo, progress, done];
let draggedItem = null;

function loadData() {
  const data = JSON.parse(localStorage.getItem("data"));
  if (!data) return;

  columns.forEach((col) => {
    const colId = col.id;
    const tasks = data[colId] || [];

    tasks.forEach((obj) => {
      const task = document.createElement("div");
      task.className = "task";
      task.draggable = true;

      task.innerHTML = `
        <h2>${obj.title}</h2>
        <p>${obj.desc}</p>
        <button class="delete-btn">Delete</button>
      `;

      makeTaskDraggable(task);

      task.querySelector(".delete-btn").addEventListener("click", () => {
        task.remove();
        saveData();
      });

      col.appendChild(task);
    });

    col.querySelector(".right").textContent =
      col.querySelectorAll(".task").length;
  });
}
loadData();

/* ---------------- TASK DRAG ---------------- */
function makeTaskDraggable(task) {
  task.addEventListener("dragstart", () => {
    draggedItem = task;
  });
}

/* apply drag to existing tasks */
document.querySelectorAll(".task").forEach(makeTaskDraggable);

/* ---------------- COLUMN DRAG ---------------- */
function addDragEventsOnColumn(col) {
  col.addEventListener("dragenter", (e) => {
    e.preventDefault();
    col.classList.add("hover-over");
  });

  col.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("hover-over");
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem) {
      col.appendChild(draggedItem);
      draggedItem = null;
    }
    col.classList.remove("hover-over");

    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");
      count.textContent = tasks.length;
    });
    saveData();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

/* ---------------- MODAL ---------------- */
toggleModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

bg.addEventListener("click", () => {
  modal.classList.remove("active");
});



/* ---------------- ADD TASK ---------------- */
addBtn.addEventListener("click", () => {
  const taskTitle = taskInput.value.trim();
  const taskDesc = taskText.value.trim();

  if (!taskTitle) return;

  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  task.innerHTML = `
    <h2>${taskTitle}</h2>
    <p>${taskDesc}</p>
    <button class="delete-btn">Delete</button>
  `;

  makeTaskDraggable(task);

  task.querySelector(".delete-btn").addEventListener("click", () => {
    task.remove();
    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");
      count.textContent = tasks.length;
    });
    saveData();
  });

  todo.appendChild(task);
  taskInput.value = "";
  taskText.value = "";

  modal.classList.remove("active");
  // todo;
  const tasks = todo.querySelectorAll(".task");
  const count = todo.querySelector(".right");
  count.textContent = tasks.length;
  saveData();
});

function saveData() {
  // clear previous data
  taskData.todo = [];
  taskData.progress = [];
  taskData.done = [];

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    taskData[col.id] = Array.from(tasks).map((task) => {
      return {
        title: task.querySelector("h2").textContent,
        desc: task.querySelector("p").textContent,
      };
    });
  });

  localStorage.setItem("data", JSON.stringify(taskData));
  
}
