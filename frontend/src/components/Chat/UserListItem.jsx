import { Avatar, Box, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction, theme }) => {
  return (
    <Stack
      w={"100%"}
      display={"flex"}
      flexDirection={"row"}
      //   spacing={2}
      alignItems={"center"}
      p={"5px"}
      m={"10px 0"}
      borderRadius={"20px"}
      className={"div-shadow"}
      _hover={{ bgColor: theme ? "#d8d8d8" : "#2c2c2c9b" }}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      <Avatar size={"md"} name={user?.name} src={user?.pic} />
      <Box d={"flex"} alignItems={"center"} justifyContent={"flex-start"}>
        <Text textAlign={"left"} fontSize={"14px"} fontFamily={"Poppins"}>
          {user?.name}
        </Text>
        <Text fontSize={"12px"} fontFamily={"Poppins"}>
          <span style={{ fontWeight: "500" }}>Email: </span>
          {user?.email}
        </Text>
      </Box>
    </Stack>
  );
};

export default UserListItem;
