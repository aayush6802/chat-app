import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useStatStyles,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import UserListItem from "../Chat/UserListItem";
import UserBadge from "./UserBadge";
import { API_URL, ChatState } from "../../context/ChatProvider";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats, theme } = ChatState();
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.get(
        API_URL + `/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResults(res.data);
    } catch (error) {
      // console.log(error);
      setLoading(false);
      // write a toast
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      //write a toast
      toast({
        title: "Already added.",
        description: `${userToAdd.name} has been already selected for the group chat.`,
        status: "info",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };
  const handleDelete = (userToDelete) => {
    setSelectedUsers([
      ...selectedUsers.filter((item) => item._id !== userToDelete._id),
    ]);
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      //write a toast
      toast({
        title: "Please fill all fields",
        description:
          "Make sure you have given a group name and selected atleast 2 users.",
        status: "warning",
        position: "bottom",
        duration: 2000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.post(
        API_URL + "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // console.log(res.data);
      setChats([res.data, ...chats]);
      setLoading(false);
      onClose();
      // write a success toast
      toast({
        title: "Group created successfully!",
        status: "success",
        position: "bottom",
        duration: 3000,
        isClosable: false,
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        size={["sm", "md"]}
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearchResults([]);
        }}
      >
        <ModalOverlay />
        <ModalContent
          bg={theme ? "white" : "gray.900"}
          color={theme ? "black" : "gray.200"}
        >
          <ModalHeader textAlign={"center"}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                type="text"
                placeholder="Enter Group Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                mb={3}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add User..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
              m={"10px 0"}
              display={"flex"}
              flexWrap={"wrap"}
              gap={2}
              overflow={"scroll"}
            >
              {selectedUsers?.map((selectedUser) => (
                <UserBadge
                  key={selectedUser._id}
                  user={selectedUser}
                  handleFunction={() => handleDelete(selectedUser)}
                />
              ))}
            </Box>
            {loading ? (
              <Loader />
            ) : (
              searchResults?.map((result, index) => (
                <UserListItem
                  key={result._id}
                  user={result}
                  handleFunction={() => handleGroup(result)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant={"none"}
              color={theme ? "black" : "white"}
              onClick={() => handleSubmit()}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
