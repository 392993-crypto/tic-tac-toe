 const express = require('express');
 const fs = require('fs');
 const path = require('path');
 const app = express();

 // Middleware to parse incoming JSON bodies
 app.use(express.json());

 // Define the path to your JSON database
 const usersFilePath = path.join(__dirname, 'data', 'users.json');

 app.post('/api/register', (req, res) => {
     const { username, password } = req.body;

     // Basic validation
     if (!username || !password) {
         return res.status(400).json({ message: 'Username and password are required.' });
     }

     try {
         // 1. Read the current users from the JSON file
         const usersData = fs.readFileSync(usersFilePath, 'utf8');
         const users = JSON.parse(usersData);

         // 2. Check if the username is already taken
         const userExists = users.some(user => user.username === username);
         if (userExists) {
             return res.status(409).json({ message: 'Username already exists.' });
         }

         // 3. Add the new user to the array (saving password in plain text as requested)
         const newUser = { username, password };
         users.push(newUser);

         // 4. Write the updated array back to the JSON file
         fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

         // 5. Send a success response back to register.js
         res.status(201).json({ message: 'Registration successful!' });

     } catch (error) {
         console.error('Database error:', error);
         res.status(500).json({ message: 'Internal server error.' });
     }
 });

 // ... start your server