const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Point this to your 'public' folder where your HTML/CSS/JS live
app.use(express.static(path.join(__dirname, '../public')));

const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Ensure data directory and file exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));

// --- AUTH ROUTES ---

// Registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    if (users.some(u => u.username === username)) return res.status(409).json({ message: 'Username exists.' });

    users.push({ username, password });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'Registration successful!' });
});

// Login (The missing piece!)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful!', username: user.username });
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth'); // Import your routes

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Tell Express where the static files (CSS, JS, raw HTML) live
app.use(express.static(path.join(__dirname, '../public')));

// Hook up the auth router
app.use('/', authRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});