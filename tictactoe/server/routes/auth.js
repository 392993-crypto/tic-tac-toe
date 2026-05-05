const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// JSON API: register (used by register.js fetch)
router.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists.' });
    }
    users.push({ username, password });
    saveUsers(users);
    res.status(201).json({ message: 'Registration successful!' });
});

// JSON API: login
router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = getUsers().find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid username or password.' });
    
    // Set cookies
    res.cookie('loggedIn', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.cookie('username', username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    
    res.json({ message: 'Login successful', username: user.username });
});

// Form POST: /login (used by login.html form action)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = getUsers().find(u => u.username === username && u.password === password);
    if (!user) return res.redirect('/login.html?error=1');
    
    // Set cookies
    res.cookie('loggedIn', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.cookie('username', username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    
    res.redirect('/game.html');
});

// Form POST: /register (in case any page uses form action="/register")
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.redirect('/register.html?error=1');
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.redirect('/register.html?error=exists');
    }
    users.push({ username, password });
    saveUsers(users);
    res.redirect('/login.html');
});

// Check if user is logged in
router.get('/api/check-auth', (req, res) => {
    if (req.cookies && req.cookies.loggedIn === 'true') {
        res.json({ loggedIn: true, username: req.cookies.username });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
