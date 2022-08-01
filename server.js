"use strict";

const app = require("./app");

const { PORT } = require("./config");

const server = require("http").createServer(app);

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connection!!!!!!");
  socket.emit("connection made", () => {
    console.log("sent connection made");
  });
  socket.on("game start", () => {
    console.log("game start");
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
