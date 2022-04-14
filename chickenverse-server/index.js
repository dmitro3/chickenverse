import { Server } from "socket.io";

const io = new Server(3001);

io.on("connection", (socket) => {});
