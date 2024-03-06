import React, { useEffect, useState } from "react";
import { Box, Avatar, Text, Tooltip, useToast } from "@chakra-ui/react";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { API_URL } from "../../context/ChatProvider";

const ScrollableChat = ({ messages, setMessages, loggedInUser, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const toast = useToast();

  const deleteMessage = async (messageId) => {
    if (messageId === "") return;
    try {
      // console.log("Clicked");
      // console.log(messageId);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };
      const res = await axios.delete(
        API_URL + `/api/message/delete/${messageId}`,
        config
      );
      setMessages(messages.filter((message) => message._id !== messageId));
      // console.log(res.data);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error",
        description: "Error deleting message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width={"100%"} height={""}>
      {messages.map((message, index) => (
        <Box
          key={index}
          display={"flex"}
          flexDirection={
            message.sender._id === loggedInUser._id ? "row-reverse" : "row"
          }
          align="center"
          mb={2}
          width={"100%"}
        >
          {message.sender._id !== loggedInUser._id && (
            <Avatar
              src={message.sender.pic}
              alt={`${message.sender.name}'s avatar`}
              mr={2}
              ml={2}
              size="sm"
            />
          )}

          <Box
            maxW={["90%", "40%"]}
            bg={
              message.sender._id === loggedInUser._id ? "cyan.400" : "gray.400"
            }
            color={
              message.sender._id === loggedInUser._id
                ? "white"
                : theme
                ? "gray.200"
                : "black"
            }
            p={[3, 3]}
            gap={2}
            display={"flex"}
            borderRadius="20px"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            wordBreak={"break-all"}
          >
            <Box>
              <Text fontSize="xs" color={"black"}>
                {message.content}
              </Text>
              <Text
                fontSize="xx-small"
                color={"black"}
                textAlign="right"
                mt={1}
              >
                {moment(message.createdAt).format("LT")}
              </Text>
            </Box>
            {hoveredIndex === index &&
              message.sender._id === loggedInUser._id && (
                <Tooltip
                  label="Delete message"
                  borderRadius={"20px"}
                  bgColor={"gray"}
                  hasArrow
                >
                  <span
                    style={{ display: "flex", alignItems: "center" }}
                    _hover={{
                      bg:
                        message.sender._id === loggedInUser._id
                          ? "cyan.600"
                          : "gray.500",
                      transition: "background 1s ease-in-out",
                    }}
                    transition="background 1s ease-in-out" // Smooth transition
                    onClick={() => {
                      deleteMessage(message._id);
                    }}
                  >
                    <MdDelete cursor={"pointer"} size={"18px"} />
                  </span>
                </Tooltip>
              )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ScrollableChat;
