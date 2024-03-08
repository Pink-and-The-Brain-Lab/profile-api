import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const socketIo = http.createServer(app);
const socketConfig = { cors: { origin: "*" } };
const io = new Server(socketIo, socketConfig);
let socketConnection: any;

io.on('connection', (socket: any) => {
    console.log('Client connected...', socket.id);
    socketConnection = socket;
});

export { socketIo, socketConnection };