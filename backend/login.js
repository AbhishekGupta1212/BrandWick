const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(bodyParser.json());

let users = [
    { id: 1, email: 'user1@gmail.com', password: '$2b$10$lk5tEiYeDj50T9wFZoGqOQR0FuVUWiQRGdqnIjLVpZcwBxTKHqx2' },
    { id: 2, email: 'user2@gmail.com', password: '$2b$10$4Ni/uFxCUXoMJnBWdRKMOrNXmhWmBfUoRnE/NyTiCnPbZFbIqwgO' }
];

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { id: users.length + 1, email, password: hashedPassword };
        users.push(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id }, 'secret_key');
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/auth/user', (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Access denied' });
        }
        const user = jwt.verify(token.split(' ')[1], 'secret_key');
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));