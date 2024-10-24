
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'task',
    password: 'task123!!',
    database: 'task'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');
        
        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err) => {
            if (err) return res.status(500).send('Error creating user');
            res.status(201).send('User registered');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) return res.status(500).send('Server error');
        if (result.length === 0) return res.status(404).send('User not found');

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).send('Error comparing passwords');
            if (isMatch) {
                const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key');
                res.status(200).json({ token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    });
});

app.post('/tickets', authenticateToken, (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    db.query('INSERT INTO tickets (title, description, user_id, status) VALUES (?, ?, ?, "open")', 
        [title, description, userId], (err) => {
        if (err) return res.status(500).send('Error creating ticket');
        res.status(201).send('Ticket created');
    });
});

app.put('/tickets/assign/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied');
    
    const { assignedTo } = req.body;
    const ticketId = req.params.id;

    db.query('UPDATE tickets SET assigned_to = ? WHERE id = ?', [assignedTo, ticketId], (err) => {
        if (err) return res.status(500).send('Error assigning ticket');
        res.send('Ticket assigned');
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Token required');

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

app.get('/tickets', authenticateToken, (req, res) => {
    db.query('SELECT * FROM tickets', (err, results) => {
        if (err) return res.status(500).send('Error fetching tickets');
        res.json(results);
    });
});
