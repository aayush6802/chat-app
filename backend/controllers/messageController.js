import expressAsyncHandler from "express-async-handler";
import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

// send message
export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }
  try {
    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
  }
});
export const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    throw new Error(error.message);
  }
});

// Delete message by ID
export const deleteMessage = expressAsyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  try {
    // Find the message by ID
    const message = await Message.findById(messageId);

    // Check if the message exists
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user is authorized to delete the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Delete the message
    const delMsg = await Message.findByIdAndDelete(
      { _id: messageId },
      { new: true }
    );
    console.log(delMsg);

    // Update the latest message of the chat
    const chat = await Chat.findById(message.chat);
    let latestMessage = null;
    const messages = await Message.find({ chat: message.chat });
    if (messages.length > 0) {
      latestMessage = messages[messages.length - 1];
    }
    await Chat.findByIdAndUpdate(message.chat, {
      latestMessage,
    });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
