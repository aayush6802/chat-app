import React, { useEffect } from "react";
import {
  Box,
  Container,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import logo from "../assets/Chat Sync-Logo-Transparent.png";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/chats");
    } else {
      navigate("/");
    }
  }, [user]);
  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          bgColor={"white"}
          justifyContent={"center"}
          p={"3"}
          borderRadius={"15px"}
          margin={"40px 0 20px  0"}
          width={"100%"}
          className="div-shadow"
        >
          <Image src={logo} alt="Chat Sync" width={"90px"} />
        </Box>
        <Box
          w={"100%"}
          bgColor={"white"}
          p={"3"}
          borderRadius={"15px"}
          className="div-shadow "
        >
          <Tabs isFitted variant={"soft-rounded"}>
            <TabList mb={"10px"}>
              <Tab
                _selected={{ color: "black", bg: "cyan.200" }}
                width={"50%"}
                m={"0 10px"}
                className="hover-effect"
              >
                Login
              </Tab>
              <Tab
                _selected={{ color: "black", bg: "cyan.200" }}
                w={"50%"}
                m={"0 10px"}
                className="hover-effect"
              >
                Signup
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
