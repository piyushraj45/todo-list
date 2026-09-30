const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("empty");
const countEl = document.getElementById("count");
const bar = document.getElementById("bar");
const progress = document.getElementById("progress");

const STORAGE_KEY = "todo-tasks";

// Load saved data from localStorage
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (e) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark completed");
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text; // textContent = safe from HTML injection
    text.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "\u00D7";
    del.setAttribute("aria-label", "Delete task");
    del.title = "Delete task";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, del);
    taskList.appendChild(li);
  });

  const pending = tasks.filter((t) => !t.done).length;
  countEl.textContent = tasks.length
    ? pending + " pending, " + (tasks.length - pending) + " completed"
    : "Nothing on your list yet";

  const percent = tasks.length ? Math.round(((tasks.length - pending) / tasks.length) * 100) : 0;
  bar.style.width = percent + "%";
  progress.setAttribute("aria-valuenow", percent);
  emptyMsg.classList.toggle("hidden", tasks.length > 0);
}

function addTask() {
  const value = taskInput.value.trim();
  if (!value) return;
  tasks.push({ id: Date.now(), text: value, done: false });
  taskInput.value = "";
  saveTasks();
  render();
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

render();