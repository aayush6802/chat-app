import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import { response } from "express";

export const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  // user id is not sent
  if (!userId) {
    res.status(400);
    throw new Error("User id is required");
  }

  const user = await User.findById(userId);

  // user not found
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // create new chat
  let isChat = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.send(fullChat);
    } catch (err) {
      console.log(err);
    }
  }
});

export const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email pic",
    });
    res.json(chats);
  } catch (error) {
    console.log(error);
  }
});
export const createGroup = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({ msg: "Minimum of two members required." });
  }
  users.push(req.user);
  //   check if the group already exists or not
  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      chatName: req.body.name,
      users,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(fullGroupChat);
  } catch (error) {
    console.log(error);
  }
});
export const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      res.json({ msg: "Chat Not found" });
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});
export const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      res.json({ msg: "Chat Not Found" });
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});
export const addToGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      throw new Error("User not found or Chat not found");
    } else {
      res.json(added);
    }
  } catch (error) {}
});
