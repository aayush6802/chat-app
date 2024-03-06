import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import axios from "axios";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { ArrowRightIcon } from "@chakra-ui/icons";

import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { API_URL, ChatState } from "../../context/ChatProvider";
const SearchDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  const { user, setSelectedChat, chats, setChats, theme } = ChatState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const handleSearch = async (e) => {
    if (!search) {
      // write a toast error
      toast({
        title: "Enter User!",
        description: "please enter a value in search bar",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);

      const res = await axios.get(
        API_URL + `/api/user?search=${search}`,
        config
      );
      // console.log(res.data);
      setSearchResults([...res.data]);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Enter Occured!",
        description: "Failed to search user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    // userId is the id with which logged in user will create a chat.
    try {
      setLoadingChat(true);
      const res = await axios.post(API_URL + "/api/chat", { userId }, config);
      // console.log(res.data);
      if (!chats.find((c) => c._id === res.data._id))
        setChats([res.data, ...chats]);
      setSelectedChat(res.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Enter Occured!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        ref={btnRef}
        onClick={onOpen}
        bg={theme ? "#ebe5e5" : "blackAlpha.100"}
        color={theme ? "black" : "gray.200"}
      >
        <IconButton
          bg={theme ? "#ebe5e5" : "blackAlpha.100"}
          color={theme ? "black" : "gray.200"}
          aria-label="Search database"
          variant={"none"}
          icon={
            <SearchRoundedIcon
              bgColor={theme ? "#ebe5e5" : "blackAlpha.800"}
              color={theme ? "black" : "gray.200"}
            />
          }
        />
        <Tooltip
          hasArrow
          label="Search a user to chat..."
          cursor={"pointer"}
          borderRadius={"20px"}
          bgColor={"gray"}
        >
          <Text display={["none", "flex"]}>Search</Text>
        </Tooltip>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => {
          onClose();
          // setSearchResults(null);
        }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          bgColor={theme ? "#ebe5e5" : "blackAlpha.800"}
          color={theme ? "black" : "gray.200"}
        >
          <DrawerCloseButton />
          <DrawerHeader fontFamily={"Poppins"}>Search User...</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"}>
              <Input
                placeholder="Search a user...."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                fontSize={"18px"}
                padding={"15px"}
                fontFamily={"Poppins"}
                focusBorderColor="pink.400"
              />
              <IconButton
                aria-label="Search database"
                icon={<ArrowRightIcon />}
                onClick={handleSearch}
                bgColor={theme ? "#ebe5e5" : "blackAlpha.800"}
                color={theme ? "black" : "gray.200"}
                variant={theme ? "solid" : "none"}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((item, index) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  handleFunction={() => accessChat(item._id)}
                  theme={theme}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
