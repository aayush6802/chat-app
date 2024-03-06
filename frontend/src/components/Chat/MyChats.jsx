import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Text, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "../GroupChat/GroupChatModal";
import { API_URL, ChatState } from "../../context/ChatProvider";
import { MdGroupAdd } from "react-icons/md";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    showMyChats,
    theme,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo") || {})
  );

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${loggedUser?.token}`,
    },
  };

  const fetchChats = async () => {
    try {
      let res = await axios.get(API_URL + "/api/chat", config);
      setChats(res.data);
      // console.log(res.data);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error",
        description: "Error fetching chats",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={[showMyChats ? "flex" : "none"]}
        flexDir={"column"}
        alignItems={"center"}
        bg={theme ? "#ebe5dd" : "blackAlpha.100"}
        color={theme ? "black" : "gray.200"}
        w={["100%", "30%"]}
        p={[3, 3]}
        height={["100%", "97%"]}
        ml={[0, 2]}
        borderRadius={["0px", "20px"]}
        flex={1}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          w={"100%"}
          mb={"15px"}
        >
          <Text fontSize={["sm", "1.1vw"]} fontWeight={"600"}>
            My Chats
          </Text>
          <GroupChatModal>
            <Button
              bg={theme ? "#ebe5e5" : "blackAlpha.100"}
              color={theme ? "black" : "gray.200"}
              leftIcon={[<MdGroupAdd size={"20px"} />]}
              fontSize={["xs", "0.8vw"]}
              variant={"none"}
              className={theme ? "hover-effect" : "hover-effect-dark"}
              p={1}
            >
              <Text display={["none", "inline"]}>New Group Chat</Text>
            </Button>
          </GroupChatModal>
        </Box>
        <>
          {chats ? (
            <Stack
              width={"100%"}
              overflow={"scroll"}
              display={"flex"}
              flexDirection={"column"}
              height={"100%"}
            >
              {chats.map((chat, index) => {
                return (
                  <Box
                    onClick={() => {
                      setSelectedChat(selectedChat === chat ? null : chat);
                      // setShowMyChats(!showMyChats);
                    }}
                    cursor={"pointer"}
                    bg={
                      selectedChat === chat
                        ? theme
                          ? "pink.300"
                          : "pink.700"
                        : theme
                        ? "#ebe5e5"
                        : "blackAlpha.100"
                    }
                    // opacity={theme ? "1" : "0.8"}
                    color={
                      selectedChat === chat
                        ? "white"
                        : theme
                        ? "black"
                        : "gray.200"
                    }
                    key={chat._id}
                    width={"100%"}
                    p={"10px"}
                    borderRadius={"20px"}
                    className={
                      selectedChat === chat
                        ? ""
                        : theme
                        ? "hover-effect"
                        : "hover-effect-dark"
                    }
                  >
                    {!chat.isGroupChat ? (
                      <Text
                        fontFamily={"Poppins"}
                        fontWeight={"500"}
                        fontSize={["lg", "1.1vw"]}
                      >
                        {getSender(loggedUser, chat.users)}
                      </Text>
                    ) : (
                      <Text
                        fontFamily={"Poppins"}
                        fontWeight={"500"}
                        fontSize={["lg", "1.1vw"]}
                      >
                        {chat.chatName}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </>
      </Box>
    </>
  );
};

export default MyChats;
