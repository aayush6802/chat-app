import * as React from "react";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Chat/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import Header from "../components/Chat/Header";
import { ChatState } from "../context/ChatProvider";
import ChatLoader from "../components/Loader/ChatLoader";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const { user, theme } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedUser) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [user]);
  return (
    <>
      {!user ? (
        <ChatLoader />
      ) : (
        <Box
          width={["100%", "90%"]}
          height={["100vh", "95vh"]}
          display={"flex"}
          bg={theme ? "white" : "blackAlpha.800"}
          color={theme ? "black" : "gray.200"}
          borderRadius={["0", "20px"]}
          // backgroundColor="rgba(45, 45, 45, 0.45)"
          position={"absolute"}

          // zIndex={"3"}
        >
          <Box>{user && <SideDrawer />}</Box>
          <Box width={"100%"}>
            <Box width={"100%"}>
              <Header />
            </Box>
            <Box display={"flex"} w="100%" height={"93%"} alignItems={"center"}>
              <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatsPage;
