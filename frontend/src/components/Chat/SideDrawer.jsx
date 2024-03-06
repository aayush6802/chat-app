// SideDrawer.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  DarkMode,
} from "@chakra-ui/react";
import {
  AiOutlineHome,
  AiOutlineBell,
  AiOutlineSend,
  AiOutlineEllipsis,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineLogout,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const SideDrawer = () => {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const {
    notifications,
    setNotifications,
    user,
    setUser,
    setSelectedChat,
    showMyChats,
    setShowMyChats,
    theme,
    setTheme,
  } = ChatState();

  const handleToggle = () => {
    setExpanded(!isExpanded);
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const updateUserTheme = () => {
    setTheme(!theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  };

  useEffect(() => {}, [notifications]);

  return (
    <Box
      w={[isExpanded ? "100vw" : "40px", isExpanded ? "200px" : "50px"]}
      h="100%"
      bg={theme ? "#ded9d9" : "blackAlpha.800"}
      color={theme ? "black" : "gray.200"}
      p={4}
      boxShadow="md"
      transition="width 0.3s"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      borderRadius={["0", "20px 0 0 20px"]}
      className="div-shadow"
    >
      <IconButton
        icon={<Icon as={AiOutlineMenu} />}
        onClick={handleToggle}
        variant="none"
        fontSize="xl"
        mb={4}
      />

      <VStack height={"100%"} justifyContent={"space-between"}>
        <VStack
          height={"50%"}
          spacing={6}
          align="stretch"
          justifyContent={"space-evenly"}
        >
          <Tooltip
            placement="bottom-end"
            display={isExpanded ? "none" : "inline"}
            className="tooltip-style"
            borderRadius={"20px"}
            bgColor={"#adacac"}
          >
            <Button
              leftIcon={<Icon as={AiOutlineHome} fontSize={"20px"} />}
              variant="none"
              onClick={() => {
                setShowMyChats(false);
                setSelectedChat(null);
                setExpanded(false);
              }}
            >
              {isExpanded && <Text size={["xs", "md"]}>Home</Text>}
            </Button>
          </Tooltip>

          <Menu>
            <MenuButton>
              <Tooltip
                placement="bottom-end"
                display={isExpanded ? "none" : "inline"}
                borderRadius={"20px"}
                bgColor={"#adacac"}
              >
                <Button
                  p={0}
                  variant="none"
                  leftIcon={
                    <Icon
                      as={AiOutlineBell}
                      color={
                        notifications.length > 0
                          ? "red"
                          : theme
                          ? "black"
                          : "gray.200"
                      }
                      fontSize={"20px"}
                    />
                  }
                >
                  {isExpanded && <Text>Notifications</Text>}
                </Button>
              </Tooltip>
            </MenuButton>
            <MenuList
              bg={theme ? "#ebe5e5" : "gray.900"}
              color={theme ? "black" : "gray.200"}
              border={
                theme
                  ? "1px solid #d8d8d8"
                  : "1px solid rgba(255, 255, 255, 0.1)"
              }
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    bg={theme ? "#ebe5e5" : "gray.900"}
                    color={theme ? "black" : "gray.200"}
                    key={notification._id}
                    mt={2}
                    onClick={() => {
                      setSelectedChat(notification.chat);
                      setNotifications(
                        notifications.filter(
                          (noti) => noti._id !== notification._id
                        )
                      );
                    }}
                  >
                    <Text
                      bg={theme ? "#ebe5e5" : "gray.900"}
                      color={theme ? "black" : "gray.200"}
                    >
                      {notification.chat.isGroupChat
                        ? `New message in ${notification.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notification.chat.users
                          )}`}
                    </Text>
                  </MenuItem>
                ))
              ) : (
                <MenuItem
                  bg={theme ? "#ebe5e5" : "gray.900"}
                  color={theme ? "black" : "gray.200"}
                >
                  <Text
                    bg={theme ? "#ebe5e5" : "gray.900"}
                    color={theme ? "black" : "gray.200"}
                  >
                    No notifications
                  </Text>
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          <Tooltip
            placement="bottom-end"
            display={isExpanded ? "none" : "inline"}
            borderRadius={"20px"}
            bgColor={"#adacac"}
          >
            <Button
              leftIcon={<Icon as={AiOutlineSend} fontSize={"20px"} />}
              variant="none"
              onClick={() => {
                setShowMyChats(!showMyChats);
                setExpanded(false);
              }}
            >
              {isExpanded && <Text>Chats</Text>}
            </Button>
          </Tooltip>

          <Tooltip
            placement="bottom-end"
            display={isExpanded ? "none" : "inline"}
            borderRadius={"20px"}
            bgColor={"#adacac"}
          >
            <Button
              leftIcon={
                <Icon
                  as={theme ? MdOutlineDarkMode : MdOutlineLightMode}
                  fontSize={"20px"}
                />
              }
              variant="none"
              onClick={() => {
                setTheme(!theme);
                updateUserTheme();
              }}
            >
              {isExpanded && <Text>Theme</Text>}
            </Button>
          </Tooltip>
        </VStack>

        <Tooltip
          placement="bottom-end"
          display={isExpanded ? "none" : "inline"}
          borderRadius={"20px"}
          bgColor={"#adacac"}
        >
          <Button
            leftIcon={<Icon as={AiOutlineLogout} fontSize={"20px"} />}
            variant="none"
            onClick={logoutHandler}
          >
            {isExpanded && <Text>Logout</Text>}
          </Button>
        </Tooltip>
      </VStack>
    </Box>
  );
};

export default SideDrawer;
