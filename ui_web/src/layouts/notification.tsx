import React, { useState, useEffect } from "react";
import { Dropdown, List, Badge, Typography, Card, Divider, Button } from "antd";
import { BellFilled, CloseOutlined } from "@ant-design/icons";
import "./notification.scss";
import {
  deleteNotification,
  getNotificationByUserId,
  resetLoadDeleteNotification,
  resetLoadGetNotificationByUserId,
  resetLoadUpdateSeenStatus,
  updateSeenStatus,
} from "../redux/reducer/notificationScheduleSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { ApiLoadingStatus } from "../utils/loadingStatus";
import { NotificationResponse, UpdateSeenStatusRequest } from "../api";
import { Context } from "../utils/context";
import { userRole } from "../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotiError } from "../components/notification";
dayjs.extend(relativeTime);

const { Text } = Typography;

export const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.notificationSchedule);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const getRelativeTime = (createdAt: number): any => {
    return dayjs(createdAt).fromNow();
  };

  useEffect(() => {
    dispatch(getNotificationByUserId());
  }, []);

  useEffect(() => {
    if (dataState.loadGetNotificationByUserId === ApiLoadingStatus.Success) {
      setNotifications(
        [...dataState.notification].sort(
          (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
        )
      );
      dispatch(resetLoadGetNotificationByUserId());
    }
    if (
      dataState.loadGetNotificationByUserId === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadGetNotificationByUserId());
    }
  }, [dataState.loadGetNotificationByUserId]);

  useEffect(() => {
    if (dataState.loadUpdateSeenStatus === ApiLoadingStatus.Success) {
      dispatch(resetLoadUpdateSeenStatus());
      dispatch(getNotificationByUserId());
    }
    if (
      dataState.loadUpdateSeenStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadUpdateSeenStatus());
    }
  }, [dataState.loadUpdateSeenStatus]);

  useEffect(() => {
    if (dataState.loadDeleteNotificationStatus === ApiLoadingStatus.Success) {
      dispatch(resetLoadDeleteNotification());
      dispatch(getNotificationByUserId());
    }
    if (
      dataState.loadDeleteNotificationStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadDeleteNotification());
    }
  }, [dataState.loadDeleteNotificationStatus]);

  const renderMessage = (item: NotificationResponse) => {
    const dateObj = dayjs
      .unix(item.schedule_start_time)
      .format("HH:mm DD/MM/YYYY");
    const [time, date] = dateObj.split(" ");
    if (Context.role === userRole.patient) {
      if (item.status === 1) {
        return `Bác sĩ ${item.doctor_name} đã chấp nhận lịch hẹn vào ${time} ngày ${date} của bạn`;
      }
      if (item.status === 2) {
        return `Bác sĩ ${item.doctor_name} đã tạo lịch hẹn vào ${time} ngày ${date} cho bạn`;
      } else if (item.status === 3) {
        return `Bác sĩ ${item.doctor_name} đã từ chối lịch hẹn vào ${time} ngày ${date} của bạn`;
      }
    } else if (Context.role === userRole.doctor)
      return `Bệnh nhân ${item.patient_name} đã đặt lịch hẹn vào ${time} ngày ${date}, vui lòng xác nhận`;
  };

  const NotificationBox = () => (
    <Card
      title={
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Thông báo lịch hẹn
        </div>
      }
      style={{
        width: 360,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        background: "#fff",
        color: "#000",
        borderRadius: "8px",
      }}
      bodyStyle={{
        padding: 0,
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          padding: "12px",
        }}
      >
        <List
          dataSource={notifications}
          renderItem={(item, index) => (
            <List.Item
              style={{
                padding: "12px",
                backgroundColor: item.is_seen ? "#f9f9f9" : "#e6f7ff",
                cursor: "pointer",
                transition: "background-color 0.3s, box-shadow 0.3s",
                borderRadius: "8px",
                marginBottom:
                  index === notifications.length - 1 ? "0px" : "8px",
                position: "relative",
              }}
              onClick={() => {
                if (!item.is_seen) {
                  dispatch(
                    updateSeenStatus({ id: item.id } as UpdateSeenStatusRequest)
                  );
                }
              }}
            >
              <List.Item.Meta
                title={
                  <Text
                    style={{
                      color: item.is_seen ? "#595959" : "#000",
                      fontWeight: item.is_seen ? "400" : "600",
                      fontSize: "14px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      maxWidth: "280px",
                      display: "block",
                    }}
                  >
                    {renderMessage(item)}
                  </Text>
                }
                description={
                  <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    {getRelativeTime(item.createdAt)}
                  </Text>
                }
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                type="text"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  color: "#bfbfbf",
                  background: "none",
                  transition: "color 0.3s",
                }}
                onClick={() => {
                  dispatch(deleteNotification(item.id));
                }}
              />
            </List.Item>
          )}
        />
      </div>
      <Divider style={{ margin: "0" }} />
      <div style={{ textAlign: "center", padding: "12px" }}>
        <Text
          style={{ color: "#8c8c8c", fontSize: "12px", cursor: "pointer" }}
          onClick={() => dispatch(getNotificationByUserId())}
        >
          Tải lại các thông báo
        </Text>
      </div>
    </Card>
  );

  return (
    <Dropdown
      dropdownRender={() => <NotificationBox />}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Badge
        count={notifications.filter((n) => !n.is_seen).length}
        size="small"
        style={{
          backgroundColor: "#1890ff",
        }}
      >
        <BellFilled
          style={{
            fontSize: "25px",
            cursor: "pointer",
            color: "#ffc107",
          }}
        />
      </Badge>
    </Dropdown>
  );
};
