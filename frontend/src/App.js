import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importing axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS for styling
import './App.css'; // Importing custom CSS for additional styling

const App = () => {
    // State variables
    const [tasks, setTasks] = useState([]); // State for storing tasks
    const [newTask, setNewTask] = useState({ title: '', startDate: '', endDate: '' }); // State for creating a new task
    const [editTask, setEditTask] = useState(null); // State for editing an existing task
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(''); // State for error messages

    // Fetch tasks from the server when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Function to fetch tasks from the server
    const fetchTasks = async () => {
        setLoading(true); // Set loading state to true
        setError(''); // Clear any previous errors
        try {
            const response = await axios.get('http://localhost:5000/api/tasks'); 
            
            console.log("hi",response);// Send GET request to fetch tasks
            setTasks(response.data); // Set tasks state with the fetched data
        } catch (error) {
            setError('Error fetching tasks'); // Set error message if fetching tasks fails
            console.error('Error fetching tasks:', error); // Log error to the console
        } finally {
            setLoading(false); // Set loading state to false regardless of success or failure
        }
    };

    // Function to handle creating a new task
    const handleCreateTask = async () => {
        setError(''); // Clear any previous errors
        try {
            // Validate input fields
            if (!newTask.title || !newTask.startDate || !newTask.endDate) {
                setError('Please fill in all fields'); // Set error message if any field is empty
                return; // Return early if validation fails
            }
            const response = await axios.post('http://localhost:5000/api/tasks', newTask); // Send POST request to create new task
            setTasks([...tasks, response.data]); // Add the newly created task to the tasks state
            setNewTask({ title: '', startDate: '', endDate: '' }); // Reset newTask state to clear the input fields
        } catch (error) {
            setError('Error creating task'); // Set error message if creating task fails
            console.error('Error creating task:', error); // Log error to the console
        }
    };
  
    // Function to handle editing an existing task
    const handleEditTask = async () => {
        setError(''); // Clear any previous errors
        try {
            // Validate input fields
            if (!editTask.title || !editTask.startDate || !editTask.endDate) {
                setError('Please fill in all fields'); // Set error message if any field is empty
                return; // Return early if validation fails
            }
            const response = await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, editTask); // Send PUT request to update task
            setTasks(tasks.map(task => task._id === editTask._id ? response.data : task)); // Update tasks state with the edited task
            setEditTask(null); // Reset editTask state to null to exit edit mode
        } catch (error) {
            setError('Error editing task'); // Set error message if editing task fails
            console.error('Error editing task:', error); // Log error to the console
        }
    };
// Function to handle deleting a task
const handleDeleteTask = async (id) => {
    setError(''); // Clear any previous errors
    try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`); // Send DELETE request to delete task
        setTasks(tasks.filter(task => task._id !== id)); // Remove the deleted task from the tasks state
    } catch (error) {
        setError('Error deleting task'); // Set error message if deleting task fails
        console.error('Error deleting task:', error); // Log error to the console
    }
};

    return (
        <div className="container">
            <h1 className="my-4" >TODO App</h1>

            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message if there's an error */}

            {loading ? (
                <div>Loading tasks...</div> // Display loading message if tasks are being fetched
            ) : (
                <>
                    {/* Create New Task */}
                    <div className="mb-4">
                        <h2>Task Name</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <h2>Start Date and Time</h2>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={newTask.startDate}
                                onChange={e => setNewTask({ ...newTask, startDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <h2>End Date and Time</h2>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={newTask.endDate}
                                onChange={e => setNewTask({ ...newTask, endDate: e.target.value })}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleCreateTask}>Create Task</button>
                    </div>

                    {/* List Tasks */}
                    <div className="mb-4">
                        <h2>Tasks</h2>
                        <ul className="list-group">
                            {tasks.map(task => (
                                <li key={task._id} className="list-group-item">
                                    <h5>{task.title}</h5>
                                    <p>Start: {new Date(task.startDate).toLocaleString()}</p>
                                    <p>End: {new Date(task.endDate).toLocaleString()}</p>
                                    <button className="btn btn-secondary mr-2" onClick={() => setEditTask(task)}>Edit</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    

                    {/* Edit Task */}
                    {editTask && (
                        <div className="mb-4">
                            <h2>Edit Task</h2>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Title"
                                    value={editTask.title}
                                    onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={editTask.startDate}
                                    onChange={e => setEditTask({ ...editTask, startDate: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={editTask.endDate}
                                    onChange={e => setEditTask({ ...editTask, endDate: e.target.value })}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleEditTask}>Save Changes</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
