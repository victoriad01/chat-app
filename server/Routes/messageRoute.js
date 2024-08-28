import express from "express";
import {
  createmessage,
  getMessages,
} from "../Controllers/messageController.js";

const router = express.Router();

router.post("/", createmessage);

router.get("/:chatId", getMessages);

export default router;
