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

    if (!anyGamesBeingPlayed && !userJoinedGame) {
      let randomNum = Math.floor(Math.random() * 10000);
      console.log(
        "🚀 ~ file: server.js ~ line 61 ~ socket.on ~ randomNum",
        randomNum
      );
      socket.join(`game: ${username}${randomNum}`);
    } else if (!userJoinedGame) {
      let randomNum = Math.floor(Math.random() * 10000);
      console.log(
        "🚀 ~ file: server.js ~ line 61 ~ socket.on ~ randomNum",
        randomNum
      );

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
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("finish game", (data) => {
    io.sockets.in(data.roomName).emit("game finished", data);
    console.log("finish game!!!");
  });
});

server.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
