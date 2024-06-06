const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});
/*sudo ufw allow 3000 */
const rooms = {};
const waitingUsers = [];

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado. Id del socket: ' + socket.id);

  socket.emit('rooms', Object.keys(rooms));

  socket.on('join-room', (room, userId) => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
    }

    socket.join(room);
    socket.room = room;
    socket.userId = userId;

    if (!rooms[room]) {
      rooms[room] = {
        admin: socket.id,
        users: {},
        actions: [],
        messages: [],
        pokesActivos: [],
        pokeDown:false
      };
    }

    rooms[room].users[socket.id] = {userId};

    io.to(room).emit('join-room', {room, userId});
    io.to(room).emit('message', {userId: 'servidor', message: `${userId} se ha unido a la sala.`, room});
    io.emit('rooms', Object.keys(rooms));
  });

  socket.on('find-opponent', (userId) => {
    if (waitingUsers.length > 0) {
      const opponent = waitingUsers.shift();
      const roomId = `${opponent.userId}-${userId}`;

      socket.join(roomId);
      opponent.socket.join(roomId);

      rooms[roomId] = {
        users: [opponent.userId, userId],
        messages: [],
        actions:[],
        pokesActivos: []
      };

      io.to(roomId).emit('found-opponent', {roomId, users: rooms[roomId].users});
      console.log(`Combate iniciado entre ${opponent.userId} y ${userId} en la sala ${roomId}`);
    } else {
      waitingUsers.push({userId, socket});
      console.log(`${userId} está esperando un oponente`);
    }
  });

  socket.on('leave-room', () => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      io.to(socket.room).emit('message', {
        userId: 'servidor',
        message: `${socket.userId} ha abandonado la sala.`,
        room: socket.room
      });
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', Object.keys(rooms));
      console.log(`User ${socket.id} left room ${socket.room}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      io.to(socket.room).emit('message', {
        userId: 'servidor',
        message: `${socket.userId} se ha desconectado.`,
        room: socket.room
      });
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', Object.keys(rooms));
      console.log(`User disconnected`, socket.id);
    }
  });

  socket.on('message', (data) => {
    const {room, message, userId} = data;
    io.to(room).emit('message', {userId, message, room});

    if (rooms[room]) {
      rooms[room].messages.push({userId, message, room});
      if (rooms[room].messages.length > 10) {
        rooms[room].messages.shift();
      }
    }
  });

  socket.on('request-last-messages', ({room, count}) => {
    const messages = rooms[room]?.messages || [];
    const lastMessages = messages.slice(-count);
    socket.emit('last-messages', lastMessages);
  });

  socket.on('request-rooms', () => {
    socket.emit('rooms', Object.keys(rooms));
  });

  socket.on('recibirAccion', (data) => {
    const {userId, action, danio,room, vel} = data;
    const perdedor = room.split("-");
    if (rooms[room].actions.length > 0) {
      if(rooms[room].actions[0].vel > data.vel){
        io.to(room).emit('enviarAccion',{room:room,user1:rooms[room].actions[0].userId,user2:data.userId,action1:rooms[room].actions[0].action,danioAction1:rooms[room].actions[0].danio,action2:data.action,danioAction2:data.danio});
      }else if(rooms[room].actions[0].vel < data.vel){
        if(data.action.includes("perdedor")){
          if(data.userId === perdedor[0]){
            io.to(room).emit('enviarAccion',{room:room,user2:perdedor[0],user1:perdedor[1],action2:"perder",danioAction2:0,action1:"ganar",danioAction1:0});
          }else{
            io.to(room).emit('enviarAccion',{room:room,user2:perdedor[1],user1:perdedor[0],action2:"perder",danioAction2:0,action1:"ganar",danioAction1:0});
          }
        }else{
          io.to(room).emit('enviarAccion',{room:room,user2:rooms[room].actions[0].userId,user1:data.userId,action2:rooms[room].actions[0].action,danioAction2:rooms[room].actions[0].danio,action1:data.action,danioAction1:data.danio});
        }
      }else if(rooms[room].actions[0].vel === data.vel){
        let numRandom = Math.floor(Math.random() * 2);
        if (numRandom === 0){
          io.to(room).emit('enviarAccion',{room:room,user1:rooms[room].actions[0].userId,user2:data.userId,action1:rooms[room].actions[0].action,danioAction1:rooms[room].actions[0].danio,action2:data.action,danioAction2:data.danio});
        }else{
          io.to(room).emit('enviarAccion',{room:room,user2:rooms[room].actions[0].userId,user1:data.userId,action2:rooms[room].actions[0].action,danioAction2:rooms[room].actions[0].danio,action1:data.action,danioAction1:data.danio});
        }
      }

      rooms[room].actions = [];
    } else {
      if(action.includes("cambio")){
        rooms[room].actions.push({userId,action,danio,room,vel:9999});
      }
      else{
        rooms[room].actions.push({userId,action,danio,room,vel});
      }
    }
  });

  socket.on('setPokeActivo',(data)=>{
    const {roomId,userId,pokeActivoId,equipoActivo} = data;
    if(rooms[roomId].pokesActivos.length > 0){
      io.to(roomId).emit("getPokesActivos",{user1:rooms[roomId].pokesActivos[0].userId,pokeUser1:rooms[roomId].pokesActivos[0].pokeActivoId,equipoActivo1:rooms[roomId].pokesActivos[0].equipoActivo,user2:data.userId,pokeUser2:data.pokeActivoId,equipoActivo2:data.equipoActivo})
    }else{
      rooms[roomId].pokesActivos.push({userId,pokeActivoId,equipoActivo});
    }
  });

});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
