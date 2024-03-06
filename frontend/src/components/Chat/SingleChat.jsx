import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Image,
} from "@chakra-ui/react";
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import Loader from "../Loader/Loader";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import typingGif from "../../assets/typing.gif";
import chatGif from "../../assets/chat-app-animation.json";
import ChatLoader from "../Loader/ChatLoader";
import Lottie from "lottie-react";
import { API_URL, ChatState } from "../../context/ChatProvider";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
    showMyChats,
    setShowMyChats,
    theme,
  } = ChatState();

  const { onOpen } = useDisclosure();
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();
  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      setLoading(true);
      const res = await axios.get(
        API_URL + `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(res.data);
      setLoading(false);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      //write a toast
      toast({
        title: "An error occurred.",
        description: "Unable to fetch messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (e) => {
    // console.log(e);
    if (e.type === "click" || e.key === "Enter") {
      if (newMessage && newMessage !== "undefined") {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          };
          const res = await axios.post(
            API_URL + "/api/message",
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );
          setNewMessage("");
          socket.emit("new-message", res.data);
          setMessages([...messages, res.data]);
        } catch (error) {
          //write a toast
          toast({
            title: "An error occurred.",
            description: "Unable to send message.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    }
  };

  const typingHandler = (value) => {
    setNewMessage(value);
    //Typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = 0;
    const TYPING_TIMER_LENGTH = 3000;
    setTimeout(() => {
      let timeNow = Date.now();
      if (timeNow - lastTypingTime >= TYPING_TIMER_LENGTH && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, TYPING_TIMER_LENGTH);
  };
  useEffect(() => {
    socket = io(API_URL);
    socket.emit("setup", loggedInUser);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", (room) => {
      setIsTyping(true);
    });
    socket.on("stop-typing", (room) => {
      setIsTyping(false);
    });
  }, []);
  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notification
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          console.log("rendering message received");
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  // console.log(notifications);

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            w={"100%"}
            // height={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            bg={theme ? "white" : "blackAlpha.200"}
            color={theme ? "black" : "gray.200"}
            borderRadius={[0, "20px"]}
            p={[1]}
          >
            <Text
              fontSize="lg"
              fontFamily={"Poppins"}
              display={"flex"}
              alignItems={"center"}
              gap={"5px"}
            >
              <IconButton
                onClick={() => {
                  setSelectedChat(null);
                  setFetchAgain(!fetchAgain);
                  setShowMyChats(!showMyChats);
                }}
                icon={
                  <AiOutlineArrowLeft bgColor={theme ? "white" : "gray.200"} />
                }
                borderRadius={"50%"}
                mr={["10px"]}
                variant={theme ? "solid" : "none"}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  {" "}
                  <Avatar
                    size={"sm"}
                    name={getSenderFull(user, selectedChat.users)?.name}
                    src={getSenderFull(user, selectedChat.users)?.pic}
                  />{" "}
                  {getSenderFull(user, selectedChat.users).name}
                </>
              ) : (
                <>
                  {" "}
                  <Avatar
                    size={"sm"}
                    name={getSenderFull(user, selectedChat.users)?.name}
                    src={getSenderFull(user, selectedChat.users)?.pic}
                  />
                  {selectedChat.chatName.toUpperCase()}
                </>
              )}
            </Text>
            {/* // write a menu with three dots iconButton on clicking of what a
            menu open which has an option of edit Group */}
            <Menu
              bg={theme ? "white" : "gray.900"}
              color={theme ? "black" : "gray.200"}
            >
              <MenuButton
                display={selectedChat.isGroupChat ? "inline" : "none"}
                p={0}
                as={Button}
                rightIcon={<CiMenuKebab />}
                borderRadius={"50%"}
                variant={"none"}
              />
              <MenuList
                bg={theme ? "white" : "gray.900"}
                color={theme ? "black" : "gray.200"}
                border={"none"}
              >
                <MenuItem
                  bg={theme ? "white" : "gray.900"}
                  color={theme ? "black" : "gray.200"}
                >
                  <Text onClick={onOpen}>
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchAllMessages={fetchAllMessages}
                    />
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box
            w={"100%"}
            height={["92%", "91%"]}
            display={"flex"}
            flexDirection={"column"}
            flex={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            bg={theme ? "#ebe5e5" : "blackAlpha.100"}
            color={theme ? "black" : "gray.200"}
            borderRadius={["0", "20px"]}
            p={3}
            mt={[1, 3]}
          >
            {loading ? (
              <ChatLoader />
            ) : (
              <Box
                style={{
                  width: "100%",
                  bgColor: "green",
                  overflow: "auto",
                }}
              >
                <ScrollableChat
                  loggedInUser={user}
                  messages={messages}
                  setMessages={setMessages}
                  theme={theme}
                />
              </Box>
            )}
            {isTyping && (
              <Image src={typingGif} alt="Typing..." width={"80px"} />
            )}
            <FormControl
              isRequired
              onKeyDown={sendMessage}
              display={"flex"}
              gap={2}
              // alignItems={"center"}
              flexDirection={"row"}
            >
              <Input
                type="text"
                placeholder="Type a message"
                onChange={(e) => typingHandler(e.target.value)}
                value={newMessage || ""}
                minW={"50%"}
                _placeholder={{
                  opacity: 1,
                  color: theme ? "gray.500" : "gray.200",
                }}
                // _active={{
                //   borderColor: "pink.400",
                // }}
                bgColor={theme ? "gray.300" : "gray.700"}
                borderColor={"transparent"}
                focusBorderColor="pink.400"
                borderRadius={"20px"}
              />
              <Button
                rightIcon={<AiOutlineSend />}
                borderRadius={"20px"}
                bgColor={theme ? "pink.400" : "pink.700"}
                color={"white"}
                variant={"none"}
                fontSize={["xs", "sm"]}
                _hover={{
                  bgColor: theme ? "pink.500" : "pink.800",
                }}
                p={["xs", "sm"]}
                onClick={(e) => {
                  sendMessage(e);
                }}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          w={"100%"}
          height={"100%"}
          display={[showMyChats ? "none" : "flex", "flex"]}
          flexDirection={["column", "row"]}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box width={["25%", "8%"]}>
            <Lottie
              animationData={chatGif}
              loop={true}
              style={{
                width: "100%",
              }}
            />
          </Box>

          <Text
            color={theme ? "black" : "gray.200"}
            fontFamily={"Poppins"}
            fontSize={["5vw", "2vw"]}
            fontWeight={500}
            ml={2}
          >
            Select a chat to start.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
