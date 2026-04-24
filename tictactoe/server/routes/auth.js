const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to your JSON "database"
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users
const getUsers = () => {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
};

// Helper function to save users
const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// REGISTER
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Saving plain text as requested
    const newUser = { username, password };
    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: "User registered successfully" });
});

// LOGIN
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // In a real app, you'd set a session or JWT here.
    // For CP02, we'll just return success.
    res.json({ message: "Login successful", username: user.username });
});

module.exports = router;