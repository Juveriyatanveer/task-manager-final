const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 Fake in-memory storage (replaces MongoDB)
let tasks = [];

// Home route
app.get("/", (req, res) => {
  res.send("🚀 Team Task Manager API Running (No DB Mode)");
});

// Get tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add task
app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
    status: "pending",
  };

  tasks.push(task);
  res.json(task);
});

// Update task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  tasks = tasks.map(t =>
    t.id === id ? { ...t, ...req.body } : t
  );

  res.json({ message: "updated" });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ message: "deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});