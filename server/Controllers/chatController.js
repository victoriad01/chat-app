import chatModel from "../Models/chatModel.js";

// createChat
export const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  if (!firstId || !secondId)
    return res.status(400).json({ message: "Both ID Required!" });
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);
    const newChat = new chatModel({
      members: [firstId, secondId],
    });
    const response = await newChat.save();
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//findUserChats
export const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ message: "User ID Required!" });
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//findChat
export const findChats = async (req, res) => {
  const { firstId, secondId } = req.params;

  if (!firstId || !secondId)
    return res.status(400).json({ message: "Both ID Required!" });

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
