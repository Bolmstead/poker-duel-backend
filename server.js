"use strict";

const app = require("./app");

const { PORT } = require("./config");

const { Server } = require("socket.io");

const cors = require("cors");

app.use(cors());

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  },
});

io.on("connection", (socket) => {
  console.log("connection!!!!!!", io.sockets.adapter.rooms);
  socket.emit("connection made", () => {
    console.log("sent connection made");
  });
  socket.on("join room", (username) => {
    console.log("join room", username);

    const roomArray = Array.from(io.sockets.adapter.rooms);
    console.log(
      "🚀 ~ file: server.js ~ line 35 ~ socket.on ~ roomArray",
      roomArray
    );
    let anyGamesBeingPlayed = false;
    let anyGamesOpen = false;
    let userJoinedGame = false;
    for (let rm of io.sockets.adapter.rooms) {
      if (typeof rm[0] !== "string") {
        console.log("NOT STRING");
        continue;
      }
      let isActualGame = rm[0].substring(0, 5) === "game:";
      console.log(
        "🚀 ~ file: server.js ~ line 43 ~ socket.on ~ isActualGame",
        isActualGame
      );
      if (isActualGame) {
        anyGamesBeingPlayed = true;
        if (rm[1].size === 1) {
          console.log("set size of 1");
          socket.join(rm);
          userJoinedGame = true;
          break;
        }
      }
    }
    if (!anyGamesBeingPlayed && !userJoinedGame) {
      let randomNum = Math.floor(Math.random() * 10000);
      console.log(
        "🚀 ~ file: server.js ~ line 61 ~ socket.on ~ randomNum",
        randomNum
      );
      socket.join(`game: ${username}${randomNum}`);
    } else if (!anyGamesOpen && !userJoinedGame) {
      let randomNum = Math.floor(Math.random() * 10000);
      console.log(
        "🚀 ~ file: server.js ~ line 61 ~ socket.on ~ randomNum",
        randomNum
      );

      socket.join(`game: ${username}${randomNum}`);
    }
    console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
  });
  socket.on("game start", (data) => {
    console.log("game start");
    socket.to(data.room).emit("game started", data);
  });

  socket.on("card played", (data) => {
    console.log("card played");
    socket.broadcast.emit("card played", data);
  });
  socket.on("player joined", () => {
    console.log("player joined");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("placed card", () => {
    console.log("user placed card");
  });
});

server.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
