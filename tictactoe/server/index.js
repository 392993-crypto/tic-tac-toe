const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Tell Express to serve your static files (HTML, CSS, JS) from the root folder
app.use(express.static(__dirname));

// Set up the simple JSON database
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Auto-create the data folder and users.json file if they don't exist yet
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

// The Registration Endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);

        // Check if user exists
        if (users.some(user => user.username === username)) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Save new user (plain text password as requested for this project)
        users.push({ username, password });
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});