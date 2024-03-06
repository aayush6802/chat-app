import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const API_URL = import.meta.env.VITE_SERVER_API_URL;

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showMyChats, setShowMyChats] = useState(false);
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || true
  ); // false -> DarkMode
  const navigate = useNavigate();
  const value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    showMyChats,
    setShowMyChats,
    theme,
    setTheme,
  };

  // Get the current logged in user. If there is no user, redirect to login page.
  const checkUser = async () => {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    // if (!userInfo) {
    //   navigate("/");
    //   return;
    // }
  };
  useEffect(() => {
    checkUser();
  }, []);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
