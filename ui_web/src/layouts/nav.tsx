import { Layout, theme, Menu } from "antd";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, HomeOutlined, SettingOutlined, WechatWorkOutlined } from "@ant-design/icons";
import "./nav.scss";
import logo from "../assets/logo.png";

const { Sider } = Layout;

export const Nav = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = React.useState<any>("/");
  const { pathname } = useLocation();
  React.useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);
  
  return (
    <Sider width={200} style={{ background: colorBgContainer }}>
      <div className="brand">
        <img alt="ecg healthcare" src={logo} />
      </div>

      <Menu
        mode={"inline"}
        selectedKeys={selectedKey}
        defaultSelectedKeys={["/"]}
        className="menu-sidebar"
      >
        <Menu.Item className="menu-item" key="/" onClick={() => navigate("/")}>
          <span className="menu-item-box-icon">
            <HomeOutlined />
          </span>
          <span>{"Trang chủ"}</span>
        </Menu.Item>

        <Menu.Item
          className="menu-item"
          key="/chat"
          onClick={() => navigate("/chat")}
        >
          <span className="menu-item-box-icon">
            <WechatWorkOutlined />
          </span>
          <span>Chat nhóm</span>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="5">
          {"Quản lí tài khoản"}
        </Menu.Item>
        <Menu.Item
          className="menu-item"
          key="/account"
          onClick={() => navigate("/account")}
        >
          <span className="menu-item-box-icon">
            <UserOutlined />
          </span>
          <span>Tài khoản</span>
        </Menu.Item>

        <Menu.Item
          className="menu-item"
          key="/setting"
          onClick={() => navigate("/")}
        >
          <span className="menu-item-box-icon">
            <SettingOutlined />
          </span>
          <span>Cài đặt</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
