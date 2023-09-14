const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid'); // Import the uuid library
const dotEnv = require('dotenv');
dotEnv.config();
const cors=require('cors')

const app = express();

app.use(cors())

app.use(bodyParser.json());

// Load tasks from the JSON file
const loadTasks = () => {
  try {
    const data = fs.readFileSync('Tasks.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save tasks to the JSON file
const saveTasks = (tasks) => {
  fs.writeFileSync('Tasks.json', JSON.stringify(tasks), 'utf8');
};

// API endpoints

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  console.log(title);
  console.log('Request Body:', req.body);

  if (!title || !description) {
    return res.status(400).json({ error: 'All Fields are required' });
  }

  const tasks = loadTasks();

  // Generate a unique UUID for the new task
  const newTaskId = uuid.v4();

  const newTask = { id: newTaskId, title, description };
  tasks.push(newTask);
  saveTasks(tasks);

  res.json(newTask);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = loadTasks();

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  res.json({ message: 'Task deleted successfully' });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
