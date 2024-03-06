import React from "react";
import { Skeleton, Flex, VStack, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  );
};

export default ChatLoading;
