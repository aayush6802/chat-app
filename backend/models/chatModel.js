import mongoose from "mongoose";

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);
export default Chat;
