import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  useToast,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import UserBadge from "./UserBadge";
import Loader from "../Loader/Loader";
import UserListItem from "../Chat/UserListItem";
import axios from "axios";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { API_URL, ChatState } from "../../context/ChatProvider";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchAllMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, theme } = ChatState();
  //   const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.put(
        API_URL + `/api/chat/rename`,
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );
      setRenameLoading(false);
      setSelectedChat(res.data);
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      setRenameLoading(false);
      console.log(error);
      // write a toast
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

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
  const handleAddUser = async (searchedUser) => {
    // write a check if the selected user is already in he group
    // console.log(searchedUser);
    if (!searchedUser) return;
    let usersInGroup = [...selectedChat.users];
    if (usersInGroup.find((u) => u._id === searchedUser?._id)) {
      //write a toast
      toast({
        title: "Already added.",
        description: `${searchedUser.name} has been already selected for the group chat.`,
        status: "info",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // write a check if current logged in user id admin of selected chat
    if (selectedChat?.groupAdmin?._id !== loggedUser?._id) {
      //write a toast
      toast({
        title: "Not allowed.",
        description: `You are not allowed to add users to this group.`,
        status: "info",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.put(
        API_URL + "/api/chat/groupadd",
        { userId: searchedUser._id, chatId: selectedChat._id },
        config
      );
      // console.log(res.data);
      setLoading(false);
      setSelectedChat(res.data);
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      setLoading(false);
      //write a toast
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };
  const handleRemoveUser = async (userToDeleteFromGroup) => {
    // write a check if current logged in user id admin of selected chat
    if (selectedChat?.groupAdmin?._id !== loggedUser?._id) {
      //write a toast
      toast({
        title: "Not allowed.",
        description: `You are not allowed to remove users from this group.`,
        status: "info",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.put(
        API_URL + "/api/chat/groupremove",
        { userId: userToDeleteFromGroup._id, chatId: selectedChat._id },
        config
      );
      // console.log(res.data);
      setLoading(false);
      setSelectedChat(res.data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      onClose();
    } catch (error) {
      setLoading(false);
      //write a toast
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };
  const handleExitGroup = async () => {
    // write a check if current logged in user id admin of selected chat
    if (selectedChat?.groupAdmin?._id === loggedUser?._id) {
      //write a toast
      toast({
        title: "Not allowed.",
        description: `You are admin of this group. You cannot exit this group.`,
        status: "info",
        position: "bottom",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      };
      const res = await axios.put(
        API_URL + "/api/chat/groupremove",
        { userId: loggedUser._id, chatId: selectedChat._id },
        config
      );
      // console.log(res.data);
      setLoading(false);
      setSelectedChat(res.data);
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      setLoading(false);
      //write a toast
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <div>
      <Text onClick={onOpen} color={theme ? "black" : "white"}>
        Edit Group
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={["xs", "md"]}>
        <ModalOverlay />
        <ModalContent
          bg={theme ? "white" : "gray.900"}
          color={theme ? "black" : "gray.200"}
        >
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flexWrap={"wrap"} gap={"2"} p={2}>
              {selectedChat.users?.map((selectedUser) => (
                <UserBadge
                  key={selectedUser._id}
                  user={selectedUser}
                  handleFunction={() => handleRemoveUser(selectedUser)}
                />
              ))}
              <FormControl
                display={"flex"}
                alignItems={"center"}
                mt={2}
                gap={2}
              >
                {/* an input to upadate groupname */}
                <Input
                  type="text"
                  placeholder="Update group name"
                  value={groupChatName || ""}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant={"none"}
                  bgColor={"#6f9960"}
                  color={"white"}
                  fontFamily={"Poppins"}
                  size={"sm"}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </FormControl>
              {/* FromControl to add a new user to group */}
              <FormControl
                display={"flex"}
                alignItems={"center"}
                mt={2}
                gap={2}
              >
                <Input
                  type="text"
                  placeholder="Add new user to group..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Button
                  variant={"none"}
                  bgColor={"#6f9960"}
                  color={"white"}
                  fontFamily={"Poppins"}
                  size={"sm"}
                  onClick={(e) => handleRename()}
                >
                  Add
                </Button>
              </FormControl>
              <Box margin={"auto"} width={"100%"}>
                {loading ? (
                  <Loader />
                ) : (
                  searchResults?.map((result, index) => (
                    <UserListItem
                      key={result._id}
                      user={result}
                      handleFunction={() => handleAddUser(result)}
                    />
                  ))
                )}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="none"
              onClick={() => handleExitGroup()}
              size={"sm"}
              bgColor={"#ed3232"}
              color={"white"}
            >
              Exit Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
