 const API = "http://localhost:5000"; // will work on Railway later if changed

// LOGIN (dummy login for submission)
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Enter credentials");
        return;
    }

    localStorage.setItem("user", email);
    window.location.href = "dashboard.html";
}

// DASHBOARD INIT
window.onload = () => {
    const user = localStorage.getItem("user");
    if (user && document.getElementById("welcomeText")) {
        document.getElementById("welcomeText").innerText = "Welcome " + user + " 👋";
        document.getElementById("roleText").innerText = "Role: Member";
    }
};

// TASK STORAGE (NO DB VERSION)
let tasks = [];

// CREATE TASK
function createTask() {
    const title = document.getElementById("taskTitle").value;

    if (!title) return alert("Enter task");

    const task = {
        id: Date.now(),
        title,
        status: "Pending"
    };

    tasks.push(task);
    loadTasks();
}

// LOAD TASKS
function loadTasks() {
    const list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    tasks.forEach(t => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${t.title} - ${t.status}</p>
        `;
        list.appendChild(div);
    });

    updateStats();
}

// UPDATE DASHBOARD CARDS
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status !== "Completed").length;

    if (document.getElementById("totalTasks")) {
        document.getElementById("totalTasks").innerText = total;
        document.getElementById("completedTasks").innerText = completed;
        document.getElementById("pendingTasks").innerText = pending;
    }
}

// PROJECT (simple)
let projects = [];

function createProject() {
    const name = document.getElementById("projectName").value;

    if (!name) return alert("Enter project");

    projects.push(name);

    const list = document.getElementById("projectList");
    const div = document.createElement("div");
    div.innerText = name;
    list.appendChild(div);
}

// NAV
function showDashboard() {
    alert("Dashboard view");
}

function showProjects() {
    document.getElementById("projectSection").style.display = "block";
}

function showTasks() {
    alert("Task view");
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}