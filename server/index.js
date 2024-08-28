import express from "express";
import cors from "cors";
import "dotenv/config";

import mongoose from "mongoose";
import userRoutes from "./Routes/userRoute.js";
import chatRoutes from "./Routes/chatRoute.js";
import messageRoutes from "./Routes/messageRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server running on Port ${PORT}`);
});

// mongoose
//   .connect(process.env.DB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB Connected!"))
//   .catch((error) => console.log("DB Connection Failed: ", error.message));

try {
  mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("DB Connected!");
} catch (error) {
  console.log("DB Connection Failed: ", error.message);
}
