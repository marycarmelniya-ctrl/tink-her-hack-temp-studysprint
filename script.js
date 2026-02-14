// ===== TASK VARIABLES =====
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== ADD TASK =====
addTaskBtn.addEventListener("click", function () {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") return;

    const task = {
        text: taskValue,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";
    renderTasks();
});
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});

// ===== RENDER TASKS =====
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.textContent = task.text;
        li.style.cursor = "pointer";

        // Mark complete
        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        li.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";

        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            tasks.splice(index, 1);
            renderTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    progressText.textContent = `${completedTasks} / ${tasks.length} Tasks Completed`;
}


// ===== TIMER SECTION =====
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

startBtn.addEventListener("click", function () {
    if (timer) return;

    timer = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            timer = null;
            alert("Study session complete!");
        }
    }, 1000);
});

pauseBtn.addEventListener("click", function () {
    clearInterval(timer);
    timer = null;
});

resetBtn.addEventListener("click", function () {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

updateTimerDisplay();