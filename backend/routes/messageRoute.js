import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  allMessages,
  deleteMessage,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/delete/:messageId").delete(protect, deleteMessage);

export default router;
