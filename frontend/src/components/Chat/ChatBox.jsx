import * as React from "react";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/ChatProvider";
import { AnimatePresence } from "framer-motion";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { showMyChats } = ChatState();
  return (
    <AnimatePresence>
      <>
        <Box
          p={[0, 3]}
          height={["100%", "100%"]}
          borderRadius={"20px"}
          display={[showMyChats ? "none" : "inline", "inline"]}
          flex={2}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </>
    </AnimatePresence>
  );
};

export default ChatBox;
