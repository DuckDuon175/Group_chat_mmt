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
import groupChatImg from "../../assets/groupChat.svg";
const socket = io("http://localhost:3000");

export const ChatMes: React.FC = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const dataState = useAppSelector((state) => state.chat);
  const groupState = useAppSelector((state) => state.groupChat);
  const [accountData, setAccountData] = useState<UserResponse>(
    {} as UserResponse
  );
  const [userDropDown, setUserDropDown] = useState<any[]>([]);

  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupChat, setGroupChat] = useState<GroupChatSchema[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showTimestamp, setShowTimestamp] = useState<number | null>(null);
  const [showUser, setShowUser] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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
      console.log(groupState.data);
      setGroupChat(groupState.data);
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

  // Gửi tin nhắn
  const sendMessage = () => {
    console.log(selectedGroup);
    if (newMessage.trim() !== "") {
      const messageData = {
        message: newMessage,
        groupChatId: selectedGroup,
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
    if (selectedGroup) {
      console.log("Group selected id: ", selectedGroup);
      // Gửi sự kiện tham gia nhóm
      socket.emit("joinGroup", selectedGroup);

      // Lắng nghe tin nhắn từ nhóm này
      socket.on(`receiveMessageFrom${selectedGroup}`, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off(`receiveMessageFrom${selectedGroup}`);
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      dispatch(
        loadMessages({
          receiverId: "23",
          groupChatId: selectedGroup,
        })
      );
    } else setMessages([]);
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

  const getAvatarInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCreateGroup = (values: any) => {
    console.log(values);
    const payload = {
      title: values.title,
      hostId: accountData.id,
      member: values.member,
    };

    console.log("Payload:", payload);

    dispatch(createGroupChat(payload as any));
  };

  useEffect(() => {
    if (groupState.loadCreateGroupChat == ApiLoadingStatus.Success) {
      window.alert("Bạn đã tạo nhóm thành công!");
      setIsModalOpen(false);
      form.resetFields();
      dispatch(getGroupChat(accountData.id));
      dispatch(resetLoadCreateGroupChat());
    }
  }, [groupState.loadCreateGroupChat]);

  return (
    <div className="chat-container">
      <div className="sidebar">
        <Button
          style={{
            marginBottom: "10px",
            borderRadius: "8px",
            height: "35px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          + Tạo nhóm chat
        </Button>
        <Input type="text" className="search" placeholder="Tìm kiếm..." />
        <ul className="chat-groups">
          {groupChat.map((item) => (
            <li
              className={`group-item ${
                item._id === selectedGroup ? "selected" : ""
              }`}
              key={item._id}
              onClick={() => {
                setGroupTitle(item.title);
                setSelectedGroup(item._id);
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-box-container">
        {groupTitle.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <img
              src={groupChatImg}
              alt="No Group Selected"
              style={{ width: "550px"}}
            />
            <h3>Tạo hoặc chọn một nhóm để bắt đầu nhắn tin!</h3>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h2>Tin nhắn nhóm {groupTitle}</h2>
            </div>

            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === accountData.id ? "self" : "other"
                    }`}
                    onMouseEnter={() => {
                      setShowTimestamp(index);
                      setShowUser(msg.senderName);
                    }}
                    onMouseLeave={() => setShowTimestamp(null)}
                    style={{ position: "relative", cursor: "pointer" }}
                  >
                    <div className={`avatar ${msg.before ? "hidden" : ""}`}>
                      {getAvatarInitial(msg.senderName)}
                    </div>

                    {msg.senderId === accountData.id ? (
                      <div>
                        <Row gutter={5}>
                          <Col>
                            {showTimestamp === index && (
                              <div className="message-time">
                                <em>
                                  {showUser} -{" "}
                                  {new Date(msg.time).toLocaleString()}
                                </em>
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
                        <Row gutter={5}>
                          <Col>
                            <span>{msg.message}</span>
                          </Col>
                          <Col>
                            {showTimestamp === index && (
                              <div className="message-time">
                                <em>
                                  {showUser} -{" "}
                                  {new Date(msg.time).toLocaleString()}
                                </em>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>Chưa có tin nhắn nào trong nhóm này!</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập tin nhắn */}
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
          </>
        )}
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
            name="title"
            key="title"
            style={{ marginTop: "30px", marginBottom: "0px" }}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
          <Form.Item
            label="Thành viên"
            name="member"
            key="member"
            style={{ marginTop: "15px" }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thành viên"
              options={userDropDown}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
