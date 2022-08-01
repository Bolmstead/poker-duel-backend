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
  console.log("connection!!!!!!", socket.id);
  socket.emit("connection made", () => {
    console.log("sent connection made");
  });
  socket.on("game start", (data) => {
    console.log("game start");
    socket.broadcast.emit("game started", data);
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
