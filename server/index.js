import cors from "cors";
import express from "express";
import http from "http";
import "./db/conn.js";
import { Server } from "socket.io";
import router from "./api/routes.js";
import sockets from "./socket/sockets.js";

const app = express();
const PORT = 4000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(cors());

app.use("/", router);

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log("Server is running at http://localhost:4000");
});
