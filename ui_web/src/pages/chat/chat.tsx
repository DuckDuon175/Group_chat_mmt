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
import { getUserById } from "../../redux/reducer/userSlice";

const socket = io("http://localhost:3000");

export const ChatMes: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.chat);
  const userDataState = useAppSelector((state) => state.user);
  const [lastSentMessage, setLastSentMessage] = useState<MessageSchema | null>(
    null
  );
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [accountData, setData] = React.useState<UserResponse>(
    {} as UserResponse
  );
  const [showTimestamp, setShowTimestamp] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  React.useEffect(() => {
    dispatch(getUserById("user-info"));
  }, []);

  React.useEffect(() => {
    if (userDataState.loadGetUserByIdStatus === ApiLoadingStatus.Success) {
      setData(userDataState.userData);
      console.log("account data loaded", accountData);
    }
  }, [userDataState.loadGetUserByIdStatus]);

  useEffect(() => {
    socket.on("receivedMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receivedMessage");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        message: newMessage,
        groupChatId: "fmECG",
        timestamp: new Date().toLocaleString(),
        senderId: accountData.id,
        senderName: accountData.username,
      };

      const messageRequest = MessageRequest.fromJS(messageData);
      dispatch(sendMessageRedux(messageRequest));

      setNewMessage(""); // Reset input message
    }
  };

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
      const data = dataState.messages.reduce(
        (initial: MessageSchema[], msg) => {
          if (initial.length > 0) {
            const preId = initial[initial.length - 1].senderId;
            if (preId === msg.senderId) {
              msg.before = true;
            }
          }
          initial.push(msg);
          return initial;
        },
        []
      );
      console.log(data);
      setMessages(dataState.messages);
      dispatch(resetGetMessageStatus());
    }
  }, [dataState.loadGetMessageStatus, dispatch]);

  useEffect(() => {
    if (dataState.loadSendMessageStatus === ApiLoadingStatus.Success) {
      dispatch(resetSendMessageStatus());
    }
  }, [dataState.loadSendMessageStatus, dispatch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <input type="text" className="search" placeholder="Tìm kiếm ..." />
        <li>Nhóm cộng đồng</li>
        <li>Nhóm bác sĩ</li>
      </div>
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
                onClick={() => setShowTimestamp(index)} // Lưu index của tin nhắn đã click
              >
              
                  <div
                    className={`avatar ${msg.before === true ? "hidden" : ""}`}
                  >
                    {getAvatarInitial(msg.senderName)}
                  </div>
                
                <div>
                  <span>{msg.message}</span>
                  {showTimestamp === index && (
                    <div className="message-time">
                      <em>{msg.timestamp}</em>
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

        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
          />
          <button onClick={sendMessage} onKeyDown={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
