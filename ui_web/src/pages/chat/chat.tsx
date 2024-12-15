import { useState, useEffect, useRef } from "react";
import "./chat.scss";
import {
  loadMessages,
  resetGetMessageStatus,
  resetSendMessageStatus,
  sendMessage as sendMessageRedux,
} from "../../redux/reducer/chatSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  MessageSchema,
  MessageRequest,
  UserResponse,
  GroupChatSchema,
} from "../../api";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { getAllUsers } from "../../redux/reducer/userSlice";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";

import io from "socket.io-client";
import {
  createGroupChat,
  getGroupChat,
  resetLoadCreateGroupChat,
} from "../../redux/reducer/groupChatSlice";
const socket = io("http://localhost:3000");

export const ChatMes: React.FC = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const dataState = useAppSelector((state) => state.chat);
  const groupState = useAppSelector((state) => state.groupChat);
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [accountData, setAccountData] = useState<UserResponse>(
    {} as UserResponse
  );
  const [groupChat, setGroupChat] = useState<GroupChatSchema[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showTimestamp, setShowTimestamp] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [userDropDown, setUserDropDown] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (userState.loadDataStatus === ApiLoadingStatus.Success) {
      setUserDropDown(
        userState.data.map((user) => ({
          label: user.username,
          value: user.id,
        }))
      );
    }
  }, [userState.loadDataStatus]);

  useEffect(() => {
    if (groupState.loadGetGroupChat === ApiLoadingStatus.Success) {
      setGroupChat(groupState.data);
      console.log(groupState.data);
    }
  }, [groupState.loadGetGroupChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("ui-context") || "{}");
    setAccountData(userData);
    dispatch(getGroupChat(userData.id));
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
    console.log(selectedGroup);
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
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (!selectedGroup) {
      dispatch(
        loadMessages({
          receiverId: "23",
          groupChatId: "fmECG",
        })
      );
    }
    else setMessages([])
  }, [dispatch, selectedGroup, accountData.id]);
  

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

  const handleCreateGroup = () => {
    const payload = {
      title: groupTitle,
      hostId: accountData.id,
      member: groupMembers,
    };

    console.log("Payload:", payload);

    dispatch(createGroupChat(payload as any));
  };

  useEffect(() => {
    if (groupState.loadCreateGroupChat == ApiLoadingStatus.Success) {
      console.log("Group created successfully:");
      setIsModalOpen(false);
      form.resetFields();
      setGroupMembers([]);
      dispatch(resetLoadCreateGroupChat());
    }
  }, [groupState.loadCreateGroupChat]);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <input
          type="text"
          className="search"
          placeholder="Tìm kiếm ..."
          style={{ marginBottom: "10px" }}
        />
        <Button
          style={{ marginTop: "10px", marginBottom: "0px", height: "40px" }}
          onClick={() => setIsModalOpen(true)}
        >
          + Tạo nhóm chat
        </Button>
        <ul className="chat-groups">
          {groupChat.map((item) => (
            <li
            className={`group-item ${item._id === selectedGroup ? "selected" : ""}`}
              onClick={() => setSelectedGroup(item._id)}
            >
              {item.title}
            </li>
          ))}
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
                onClick={() =>
                  setShowTimestamp((prev) => (prev === index ? null : index))
                }
                style={{ cursor: "pointer" }}
              >
                {/* Avatar */}
                <div className={`avatar ${msg.before ? "hidden" : ""}`}>
                  {getAvatarInitial(msg.senderName)}
                </div>

                {/* Nội dung tin nhắn */}
                {msg.senderId === accountData.id ? (
                  <div>
                    <Row>
                      <Col>
                        {showTimestamp === index && (
                          <div className="message-time">
                            <em>{new Date(msg.time).toLocaleString()}</em>
                          </div>
                        )}
                      </Col>
                      <Col>
                        <span>{msg.message}</span>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    <Row>
                      <Col>
                        <span>{msg.message}</span>
                      </Col>
                      <Col>
                        {showTimestamp === index && (
                          <div className="message-time">
                            <em>{new Date(msg.time).toLocaleString()}</em>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
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

      <Modal
        width={"490px"}
        title="Tạo nhóm mới"
        open={isModalOpen}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
          setGroupMembers([]);
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleCreateGroup}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Tên nhóm"
            name="groupName"
            style={{ marginTop: "30px", marginBottom: "0px" }}
          >
            <Input
              placeholder="Nhập tên nhóm"
              onChange={(e) => setGroupTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Thành viên"
            name="members"
            style={{ marginTop: "15px" }}
          >
            <Select
              mode="multiple"
              defaultValue={[`${accountData.username}`]}
              placeholder="Chọn thành viên"
              options={userDropDown}
              allowClear
              value={groupMembers}
              onChange={(value) => setGroupMembers(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
