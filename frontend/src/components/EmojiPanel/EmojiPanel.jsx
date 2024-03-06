import React, { useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaGrin, FaHeart, FaThumbsUp } from "react-icons/fa";

const EmojiPanel = () => {
  const emojis = [FaGrin, FaHeart, FaThumbsUp];
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  return (
    <Box display="flex" gap={2}>
      {emojis.map((emoji) => (
        <IconButton
          key={emoji.name}
          onClick={() => handleEmojiClick(emoji)}
          color={selectedEmoji === emoji ? "blue.500" : "gray.400"}
        >
          {emoji}
        </IconButton>
      ))}
    </Box>
  );
};

export default EmojiPanel;
