require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./router/route');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // atau sesuaikan dengan asal frontend kamu
    }
});
app.use(cors());
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

global.io = io;
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT;
server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});
