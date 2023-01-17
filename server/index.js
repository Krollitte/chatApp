const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const app = express();
const io = require("socket.io")(5001, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const onlineUsers = [];
io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId: userId, socketId: socket.id });
    }
  });

  socket.on("send-msg", (data) => {
    console.log("data", data);
    console.log("onlineUsers", onlineUsers);

    const userToSend = onlineUsers.find((user) => user.userId === data.to);
    console.log("userToSend", userToSend);

    if (userToSend) {
      socket.to(userToSend.socketId).emit("msg-recieve", data.msg);
    }
  });
});
