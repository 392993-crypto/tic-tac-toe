const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const gamesRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, httpOnly: true }
}));

// Enable CORS for all routes
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.username) {
        return next();
    }
    // If it's an API request, return 401
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ message: 'Unauthorized - Please login' });
    }
    // For HTML pages, redirect to login
    res.redirect('/login.html');
};

// Public routes - no authentication required
app.use('/login.html', express.static(path.join(__dirname, '../public/login.html')));
app.use('/register.html', express.static(path.join(__dirname, '../public/register.html')));
app.use('/css/', express.static(path.join(__dirname, '../public/css')));
app.use('/js/', express.static(path.join(__dirname, '../public/js')));

// Auth routes (login/register/logout) - these set the session
app.use('/', authRoutes);

// Protected routes - require authentication
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/games', requireAuth, gamesRoutes);

// Protected HTML pages
app.get('/game.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game.html'));
});

app.get('/dashboard.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/leaderboard.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/leaderboard.html'));
});

app.get('/stats.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/stats.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login.html');
    });
});

// Serve index.html publicly (dev menu)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
