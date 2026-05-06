const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const gamesRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS middleware to handle cross-origin requests
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));

app.use('/', authRoutes);
app.use('/', aiRoutes);
app.use('/', gamesRoutes);

// Logout route
app.get('/logout', (req, res) => {
    res.redirect('/login.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});