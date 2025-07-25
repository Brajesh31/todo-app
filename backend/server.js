const cors = require("cors");

const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const uri = "mongodb+srv://Amaan:7861Amaan@cluster0.huwgwxg.mongodb.net/test11?retryWrites=true&w=majority";

// Function to connect to MongoDB Atlas
async function connect() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
    }
}

connect(); // Call the connect function to establish the connection

const express = require('express');
const app = express();
app.use(cors())
const port = 5000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Define the task schema using Mongoose
const taskSchema = new mongoose.Schema({
    title: String,
    startDate: Date,
    endDate: Date
});

// Create a Mongoose model based on the task schema
const Task = mongoose.model('Task', taskSchema);

// POST endpoint to create a new task
app.post('/api/tasks', async (req, res) => {
    const { title, startDate, endDate } = req.body; // Destructure task details from request body
    const task = new Task({ title, startDate, endDate }); // Create a new task instance
    await task.save(); // Save the new task to the database
    res.status(201).send(task); // Send a response with the created task data
});

// GET endpoint to retrieve all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find(); // Retrieve all tasks from the database
    res.send(tasks); // Send a response with the retrieved tasks
});

// PUT endpoint to update an existing task by ID
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params; // Extract task ID from request parameters
    const { title, startDate, endDate } = req.body; // Destructure updated task details from request body
    const task = await Task.findByIdAndUpdate(id, { title, startDate, endDate }, { new: true }); // Find and update the task by ID
    res.send(task); // Send a response with the updated task data
});

// Start the server listening on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


