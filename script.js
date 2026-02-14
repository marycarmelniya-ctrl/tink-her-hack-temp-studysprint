// ===== CONNECT ELEMENTS =====
const completedList = document.getElementById("completedList");

const add5Btn = document.getElementById("add5");
const add10Btn = document.getElementById("add10");
const customInput = document.getElementById("customMinutes");
const setCustomBtn = document.getElementById("setCustomTime");
const timeButtons = document.querySelectorAll(".time-btn");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// ===== TASK DATA (with localStorage) =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== ADD TASK =====
addTaskBtn.addEventListener("click", function () {
    const taskValue = taskInput.value.trim();
    if (!taskValue) return;

    tasks.push({
        text: taskValue,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
});

// ENTER KEY ADD
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTaskBtn.click();
});

// ===== RENDER TASKS =====
function renderTasks() {
    taskList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        // ⭐ CHECKBOX
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const text = document.createElement("span");
        text.textContent = task.text;

        if (task.completed) li.classList.add("completed");

        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked;
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            tasks.splice(index, 1);
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);

        // ⭐ MOVE COMPLETED TASKS
        if (task.completed) {
            completedList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgress();
}


// ===== UPDATE PROGRESS =====
function updateProgress() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    progressText.textContent =
        `${completedTasks} / ${total} Tasks Completed`;

    const percent = total === 0 ? 0 : (completedTasks / total) * 100;
    progressFill.style.width = percent + "%";
}

// ===== TIMER SECTION =====
let timer;
let timeLeft = 25 * 60;

// ⭐ SESSION COUNTER
let sessions = 0;

function completeSession() {
    sessions++;
    document.getElementById("sessionCount").textContent =
        "Focus Sessions Completed: " + sessions;
}

// CUSTOM TIME
setCustomBtn.addEventListener("click", function () {
    const value = parseInt(customInput.value);
    if (!value || value <= 0) return alert("Enter valid minutes");

    timeLeft = value * 60;
    updateTimerDisplay();
});

// TIME BUTTONS
timeButtons.forEach(button => {
    button.addEventListener("click", function () {
        timeLeft = this.dataset.time * 60;
        updateTimerDisplay();
    });
});

// TIMER DISPLAY
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
}

// START TIMER
startBtn.addEventListener("click", function () {
    if (timer) return;

    timer = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            timer = null;

            completeSession(); // ⭐ FIXED SESSION COUNTER

            alert("Study session complete!");
        }
    }, 1000);
});

// PAUSE
pauseBtn.addEventListener("click", function () {
    clearInterval(timer);
    timer = null;
});

// RESET
resetBtn.addEventListener("click", function () {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// ADD EXTRA TIME
add5Btn.addEventListener("click", function () {
    timeLeft += 5 * 60;
    updateTimerDisplay();
});

add10Btn.addEventListener("click", function () {
    timeLeft += 10 * 60;
    updateTimerDisplay();
});

// ===== MOTIVATION TEXT =====
const quotes = [
    "Stay focused 💪",
    "Small steps every day.",
    "Consistency beats intensity.",
    "Deep work creates success."
];

document.getElementById("motivationText").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];

// ===== INITIAL LOAD =====
updateTimerDisplay();
renderTasks();
