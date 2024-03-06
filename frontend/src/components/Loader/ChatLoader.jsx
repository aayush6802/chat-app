import React from "react";
import { Box, Spinner } from "@chakra-ui/react";

const ChatLoader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Spinner thickness="4px" size="xl" color="cyan.500" />
    </Box>
  );
};

export default ChatLoader;
