const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { getUser, removeUser, addUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  socket.on("join", ({ name, room}, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room});
    if (error) return callback(error);

    const otherUsers = getUsersInRoom(user.room).filter(
      (elem) => elem.id !== socket.id
    );
    socket.emit("other-users", otherUsers);
    socket.join(user.room);

    socket.broadcast.to(user.room).emit("user-connected", user);


    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    io.to(user.room).emit("message", {
      time: time,
      user: user.name,
      text: message,
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
