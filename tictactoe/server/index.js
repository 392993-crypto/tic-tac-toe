const express = require('express');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));

app.use('/', authRoutes);
app.use('/', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
