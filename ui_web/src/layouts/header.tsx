import { useLocation } from "react-router-dom";
import { Row, Col, Breadcrumb, Dropdown, Avatar, Input } from "antd";
import "./header.scss";
import { NavLink } from "react-router-dom";
import {
  UserOutlined,
  TranslationOutlined,
  LogoutOutlined,
  MessageFilled,
  SettingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Notification } from "./notification";
import avatar from "../assets/avatar.svg";
import { getRoutesByRole, IRouteItem } from "./routes.type";
import { Context } from "../utils/context";
import { GetProps } from "react-redux";
type SearchProps = GetProps<typeof Input.Search>;

export const HeaderBar = () => {
  const { Search } = Input;
  const { pathname } = useLocation();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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

  var menulist: { [key: string]: IRouteItem } = getRoutesByRole(Context.role);
  function getLabelByKey(key: string) {
    if (key === "/account") return "Thông tin tài khoản";

    const entry = Object.values(menulist).find((item: any) => item.key === key);
    if (!entry) return null;
    return entry.label;
  }

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <div className="header-container">
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="header-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">{t("page.breadcrumb.pages")}</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {t(getLabelByKey(pathname) ?? "page.side-bar.home")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            ></span>
          </div>
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
            <Notification />
          </div>

          <div className="header-icon-box">
            <MessageFilled style={{ color: "#17a2b8" }} />
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
