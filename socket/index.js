import { Server } from "socket.io";

const io = new Server({
  cors: "http://localhost:5173",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("NEW_CONNECTION: ", socket.id);

  // Listen to a connection to add a new user
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message
  socket.on("sendMessage", (message) => {
    const userOwn = onlineUsers.find(
      (userpair) => userpair.userId === message.recipientId
    );

    if (userOwn) {
      io.to(userOwn.socketId).emit("getMessage", message);
      console.log("getMessage Emitted!");
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(
      (disconnectedUser) => disconnectedUser.socketId !== socket.id
    );
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
