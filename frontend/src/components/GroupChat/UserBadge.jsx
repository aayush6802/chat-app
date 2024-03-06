import React from "react";
import { Flex, Text, IconButton, useColorMode } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadge = ({ user, handleFunction }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      align="center"
      borderRadius="md"
      p={1.5}
      pr={1}
      bg={"#f39392"}
      color={"white"}
    >
      <Text mr={2} fontSize={"14px"}>
        {user?.name}
      </Text>
      <IconButton
        icon={<CloseIcon />}
        onClick={() => handleFunction(user)}
        size="xs"
        variant="none"
        colorScheme="red"
      />
    </Flex>
  );
};

export default UserBadge;
