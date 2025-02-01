document.getElementById("task-form").addEventListener("submit", addTask);

let locallystoredtasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask(event) {
  event.preventDefault();

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const deadline = document.getElementById("task-deadline").value;
  const priority = document.getElementById("task-priority").value;

  const task = { title, desc, deadline, priority, completed: false };

  locallystoredtasks.push(task);
  saveTasksToLocalStorage();
  listoftasks();
  document.getElementById("task-form").reset();
}

function listoftasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  locallystoredtasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add(task.priority);

    li.innerHTML = `
      <strong>${task.title}</strong><br>
      ${task.desc}<br>
      Deadline: ${new Date(task.deadline).toLocaleString()}
      <button onclick="markCompleted(${index})">Mark as Completed</button>
    `;

    if (isDeadlineClose(task.deadline)) {
      li.classList.add("alert");
    }

    taskList.appendChild(li);
  });
}

function markCompleted(index) {
  const completedTask = locallystoredtasks.splice(index, 1)[0];
  completedTask.completed = true;

  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  completedTasks.push(completedTask);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  saveTasksToLocalStorage();
  listoftasks();
}

function isDeadlineClose(deadline) {
  const deadlineTimestamp = new Date(deadline).getTime();
  const currentTimestamp = Date.now();
  const timeDifference = deadlineTimestamp - currentTimestamp;

  const oneDayInMs = 86400000;
  return timeDifference <= oneDayInMs;
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(locallystoredtasks)); // Save tasks to localStorage
}

listoftasks();
