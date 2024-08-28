import express from "express";
import {
  createChat,
  findChats,
  findUserChats,
} from "../Controllers/chatController.js";

const router = express.Router();

// create a chat between two people
router.post("/", createChat);

// find all chat he has with other people
router.get("/find/:userId", findUserChats);

// find chat that is unique to someone
router.get("/find/:firstId/:secondId", findChats);
//firstId, secondId

export default router;
