"use strict";

require("dotenv").config();

console.log("process.env", process.env);

const app = require("./app");

const { PORT } = require("./config");

const { Server } = require("socket.io");
const mongoose = require('mongoose');

const cors = require("cors");

app.use(cors());

const server = require("http").createServer(app);

var whitelist = ["https://olmstead-ball.netlify.app", "http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const io = new Server(server, {
  cors: {
    corsOptions,
  },
});

io.sockets.on("connection", (socket) => {
  console.log("connection!!!!!!", io.sockets.adapter.rooms);
  socket.on("join room", (username) => {
    console.log("join room", username);

    const roomArray = Array.from(io.sockets.adapter.rooms);
    console.log(
      "🚀 ~ file: server.js ~ line 35 ~ socket.on ~ roomArray",
      roomArray
    );
    let anyGamesBeingPlayed = false;
    let userJoinedGame = false;
    for (let rm of io.sockets.adapter.rooms) {
      if (typeof rm[0] !== "string") {
        console.log("NOT STRING");
        continue;
      }
      let isActualGame = rm[0].substring(0, 5) === "game:";

      if (isActualGame) {
        anyGamesBeingPlayed = true;
        console.log("rm!!!", rm);
        if (rm[1].size === 1) {
          console.log("set size of 1");
          socket.join(rm, (err) => {
            if (err) {
              // do something here if the join fails
              console.log("err", err);
            } else {
            }
            // call this only after the join has completed
          });
          // socket.in(rm[0]).emit("player_joined", { username, roomName: rm[0] });
          console.log("rm[0]", rm[0]);
          io.sockets
            .in(rm[0])
            .emit("other_player_joined", { roomName: rm[0], username });

          userJoinedGame = true;

          break;
        }
      }
    }
    console.log("Rooms Before: ", io.sockets.adapter.rooms);

    console.log("anyGamesBeingPlayed", anyGamesBeingPlayed);
    console.log("userJoinedGame", userJoinedGame);
    let randomNum = Math.floor(Math.random() * 10000);

    if (!anyGamesBeingPlayed && !userJoinedGame) {
      console.log("socket.id", socket.id);

      socket.join(`game: ${username}${randomNum}`);
    } else if (!userJoinedGame) {
      console.log("socket.id", socket.id);
      socket.join(`game: ${username}${randomNum}`);
    }
    console.log("Rooms After: ", io.sockets.adapter.rooms);
  });
  socket.on("game start", (data) => {
    console.log("game start", data);
    io.sockets.in(data.roomName).emit("game started", data);
  });

  socket.on("card played", (data) => {
    console.log("card played", data);
    io.sockets.in(data.room).emit("user card played", data);
  });

  socket.on("disconnecting", (reason) => {
    console.log("❌socket.rooms,", socket.rooms);
    console.log("❌ooms Before: ", io.sockets.adapter.rooms);

    for (let rm of io.sockets.adapter.rooms) {
      if (typeof rm[0] !== "string") {
        console.log("NOT STRING");
        continue;
      }
      let isActualGame = rm[0].substring(0, 5) === "game:";

      if (isActualGame) {
        console.log("rm!!!", rm);
        if (rm[1].size === 2) {
          console.log("set size of 2");

          if (rm[1].has(socket.id)) {
            console.log("room contains user: ", rm[0]);
            io.sockets.in(rm[0]).emit("user has left", { roomName: rm[0] });
            console.log("io.sockets", io.sockets);
            io.sockets.in(rm[0]).socketsLeave(rm[0]);
            break;
          }
        }
      }
    }

    for (const room of socket.rooms) {
      console.log("room:", room);
      console.log("socket.id:", socket.id);

      if (room === `game: ${socket.id}`) {
        console.log("found the game!!!!");
        socket.to(room).emit("user has left", socket.id);
      }
    }

    console.log("❌Rooms After: ", io.sockets.adapter.rooms);
  });
  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
    console.log(reason);
    console.log("❌Rooms After: ", io.sockets.adapter.rooms);
  });
  socket.on("finish game", (data) => {
    io.sockets.in(data.roomName).emit("game finished", data);
    console.log("finish game!!!");
  });
  socket.on("rematch requested", (data) => {
    io.sockets.in(data.roomName).emit("rematch requested", data);
    console.log("rematch requested!!!");
  });
});

mongoose.connect(process.env.MONGO_URI, {

}).then(() => {
  server.listen(PORT, function () {
    console.log(`Started on http://localhost:${PORT}`);
  });
});

module.exports = app;
