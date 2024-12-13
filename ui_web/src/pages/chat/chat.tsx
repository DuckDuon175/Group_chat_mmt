import React, { useState, useEffect, useRef } from "react";
import "./chat.scss";
import {
  loadMessages,
  resetGetMessageStatus,
  resetSendMessageStatus,
  sendMessage as sendMessageRedux,
} from "../../redux/reducer/chatSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { MessageSchema, MessageRequest, UserResponse } from "../../api";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const ChatMes: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.chat);
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [accountData, setAccountData] = useState<UserResponse>(
    {} as UserResponse
  );
  const [showTimestamp, setShowTimestamp] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("ui-context") || "{}");
    setAccountData(userData);
  }, []);

  // Nhận tin nhắn từ socket
  useEffect(() => {
    socket.on("receivedMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receivedMessage");
    };
  }, []);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        message: newMessage,
        groupChatId: "fmECG",
        timestamp: new Date().toISOString(),
        senderId: accountData.id,
        senderName: accountData.username,
      };

      const messageRequest = MessageRequest.fromJS(messageData);
      dispatch(sendMessageRedux(messageRequest));
      setNewMessage(""); // Xóa nội dung input sau khi gửi
    }
  };

  // Tải tin nhắn từ API
  useEffect(() => {
    dispatch(
      loadMessages({
        receiverId: "23",
        groupChatId: "fmECG",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (dataState.loadGetMessageStatus === ApiLoadingStatus.Success) {
      setMessages(dataState.messages);
      dispatch(resetGetMessageStatus());
    }
  }, [dataState.loadGetMessageStatus, dispatch]);

  useEffect(() => {
    if (dataState.loadSendMessageStatus === ApiLoadingStatus.Success) {
      dispatch(resetSendMessageStatus());
    }
  }, [dataState.loadSendMessageStatus, dispatch]);

  // Lấy ký tự đầu tiên của tên
  const getAvatarInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <input type="text" className="search" placeholder="Tìm kiếm ..." />
        <ul className="chat-groups">
          <li className="group-item">Nhóm cộng đồng</li>
          <li className="group-item">Nhóm ABC</li>
        </ul>
      </div>

      {/* Chat box */}
      <div className="chat-box-container">
        <div className="chat-header">
          <h2>Tin nhắn cộng đồng</h2>
        </div>

        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.senderId === accountData.id ? "self" : "other"
                }`}
                onClick={() => setShowTimestamp(index)}
              >
                {/* Avatar */}
                <div className={`avatar ${msg.before ? "hidden" : ""}`}>
                  {getAvatarInitial(msg.senderName)}
                </div>

                {/* Nội dung tin nhắn */}
                <div>
                  <span>{msg.message}</span>
                  {showTimestamp === index && (
                    <div className="message-time">
                      <em>{new Date(msg.time).toLocaleString()}</em>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>Chào mừng bạn đến với nhóm chat!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};
