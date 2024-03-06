import React from "react";
import SearchDrawer from "./SearchDrawer";
import {
  Avatar,
  Box,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import logo from "../../assets/Chat Sync-Logo-Transparent.png";
import { ChatState } from "../../context/ChatProvider";

const Header = () => {
  const { user, theme, setUser } = ChatState();
  return (
    <Box
      display={"flex"}
      w={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={theme ? "#ebe5e5" : "blackAlpha.100"}
      blur={
        theme
          ? "blur(0px)"
          : "blur(10px) saturate(100%) contrast(45%) brightness(130%)"
      }
      color={theme ? "black" : "gray.200"}
      p={"4px 10px"}
      borderRadius={[0, "0px 20px 0 0px"]}
      boxShadow={["md"]}
    >
      <SearchDrawer />
      <Box zIndex={3}>
        {/* <Text>ChatSync</Text> */}
        <Image src={logo} alt="Chat Sync" width={["65px", "90px"]} />
      </Box>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={
            <Avatar size={["sm", "sm"]} name={user?.name} src={user?.pic} />
          }
          variant="none"
          rightIcon={<ChevronDownIcon />}
        />
        <MenuList
          bg={theme ? "#ebe5e5" : "gray.900"}
          color={theme ? "black" : "gray.200"}
          border={
            theme ? "1px solid #d8d8d8" : "1px solid rgba(255, 255, 255, 0.1)"
          }
        >
          <ProfileModal user={user} setUser={setUser} theme={theme}>
            <MenuItem
              display={"flex"}
              textAlign={"center"}
              bg={theme ? "#ebe5e5" : "blackAlpha.100"}
              color={theme ? "black" : "gray.200"}
            >
              Profile
            </MenuItem>
          </ProfileModal>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Header;
