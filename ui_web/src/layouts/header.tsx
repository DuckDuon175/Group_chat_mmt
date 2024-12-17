import { useLocation } from "react-router-dom";
import { Row, Col, Breadcrumb, Dropdown, Avatar, Input } from "antd";
import "./header.scss";
import { NavLink } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  MessageFilled,
  SettingOutlined,
  BellFilled,
} from "@ant-design/icons";
import avatar from "../assets/avatar.svg";
import { GetProps } from "react-redux";
type SearchProps = GetProps<typeof Input.Search>;

export const HeaderBar = () => {
  const { Search } = Input;
  const { pathname } = useLocation();

  const logOut = () => {
    console.log("he");
    localStorage.removeItem("ui-context");
    document.cookie = `expired_time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "/";
  };

  const items = [
    {
      label: (
        <NavLink
          to="/account"
          style={{ display: "flex", justifyContent: "start" }}
        >
          <UserOutlined style={{ marginRight: "8px" }} />
          Account
        </NavLink>
      ),
      key: "0",
    },
    {
      label: (
        <a href="" style={{ display: "flex", justifyContent: "start" }}>
          <SettingOutlined style={{ marginRight: "8px" }} />
          Settings
        </a>
      ),
      key: "1",
    },
    {
      label: (
        <a style={{ display: "flex" }} onClick={() => logOut()}>
          <LogoutOutlined style={{ marginRight: "8px" }} />
          Sign out
        </a>
      ),
      key: "2",
    },
  ];
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <div className="header-container">
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="header-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">{"Về trang chủ"}</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24} md={12} className="header-control">
          <div onClick={(e) => e.preventDefault()}>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Avatar
                className="user-avatar"
                size={27}
                src={avatar}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>

          <div className="header-icon-box">
            <BellFilled
              style={{
                fontSize: "25px",
                cursor: "pointer",
                color: "#ffc107",
              }}
            />
          </div>

          <div className="header-icon-box">
            <NavLink to="/chat">
              <MessageFilled style={{ color: "008afb" }} />
            </NavLink>
          </div>

          <div style={{ flex: 1, marginRight: "24px" }}>
            <Search
              placeholder="Search something here..."
              onSearch={onSearch}
              style={{ width: 450 }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
