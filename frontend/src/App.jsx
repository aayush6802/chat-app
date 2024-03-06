import { Route, Router, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import React, { createContext, useContext, useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import { ChatState } from "./context/ChatProvider";
import VerifyEmail from "./components/Authentication/VerifyEmail";

function App() {
  const { theme } = ChatState();

  return (
    <div className={!theme ? "dark-app" : "app"}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </div>
  );
}

export default App;
