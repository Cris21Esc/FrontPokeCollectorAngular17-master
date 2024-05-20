const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const MAX_CONNECTIONS = 3; // Límite de conexiones permitidas

io.on('connection', (socket) => {
  if (io.engine.clientsCount > MAX_CONNECTIONS) {
    console.log('Se ha alcanzado el límite de conexiones. Se rechaza una nueva conexión.');
    socket.disconnect(true); // Desconectar el socket
    return;
  }

  console.log('Nuevo usuario conectado');

  // Escuchar el evento 'new-message'
  socket.on('new-message', (message) => {
    console.log('new message:', message);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('new-message', message);
  });

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
