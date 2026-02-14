// ===== CONNECT ELEMENTS =====
const add5Btn = document.getElementById("add5");
const add10Btn = document.getElementById("add10");
const customInput = document.getElementById("customMinutes");
const setCustomBtn = document.getElementById("setCustomTime");
const timeButtons = document.querySelectorAll(".time-btn");
const progressFill = document.getElementById("progressFill");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// ===== TASK DATA (with localStorage) =====
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

// ENTER KEY ADD
taskInput.addEventListener("keypress", function (e) {
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

        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        // COMPLETE TOGGLE
        li.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        });

        // DELETE BUTTON
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
    updateProgress(); // ⭐ important
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    progressText.textContent =
        `${completedTasks} / ${total} Tasks Completed`;

    // ⭐ THIS PART CONTROLS VISUAL BAR
    const percent = total === 0 ? 0 : (completedTasks / total) * 100;
    progressFill.style.width = percent + "%";
}
// ===== TIMER SECTION =====
let timer;
let timeLeft = 25 * 60;

setCustomBtn.addEventListener("click", function () {
    const value = parseInt(customInput.value);

    if (!value || value <= 0) {
        alert("Enter valid minutes");
        return;
    }

    timeLeft = value * 60;
    updateTimerDisplay();
});

timeButtons.forEach(button => {
    button.addEventListener("click", function () {
        timeLeft = this.dataset.time * 60;
        updateTimerDisplay();
    });
});

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

add5Btn.addEventListener("click", function () {
    timeLeft += 5 * 60;
    updateTimerDisplay();
});

add10Btn.addEventListener("click", function () {
    timeLeft += 10 * 60;
    updateTimerDisplay();
});

// ===== INITIAL LOAD =====
updateTimerDisplay();
renderTasks();
