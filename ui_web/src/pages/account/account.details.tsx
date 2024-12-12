import React from "react";
import {
  Row,
  Col,
  Image,
  Upload,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
} from "antd";
import avatarDemo from "../../assets/avatar.svg";
import dayjs from "dayjs";
import "./account.details.scss";
import { convertGenderToString, convertRoleToString } from "../../constants";
import { useTranslation } from "react-i18next";
import { getUserById } from "../../redux/reducer/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { UserResponse } from "../../api";
import { Context } from "../../utils/context";

export function Detail() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [accountData, setData] = React.useState<UserResponse>(
    {} as UserResponse
  );
  const dataState = useAppSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(getUserById("user-info"));
  }, []);

  React.useEffect(() => {
    if (dataState.loadGetUserByIdStatus === ApiLoadingStatus.Success) {
      setData(dataState.userData);
    }
  }, [dataState.loadGetUserByIdStatus]);

  return (
    <div className="account-info">
      <Col span={22} offset={1}>
        <br />
        <Row>
          <Col>
            <div>
              <Image width={100} src={avatarDemo}></Image>
            </div>
          </Col>
          <Col>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              // beforeUpload={beforeUpload}
              // onChange={handleChange}
            >
              {/* {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )} */}
            </Upload>
          </Col>
        </Row>
        <br />
        <Form layout="vertical">
          <Row>
            <Col span={10}>
              <Form.Item label={t("column.user-name")}>
                <Input value={accountData.username} name="name" />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label={t("column.sex")}>
                <Input
                  value={convertGenderToString(accountData.gender)}
                  name="gender"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label={t("column.phone-number")}>
                <Input value={accountData.phone_number} name="name" />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label={t("column.birth")}>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  name="ngày sinh"
                  value={dayjs()}
                  onChange={(date, dateString) => {}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="Thông tin">
                <Input value={accountData.information} name="email" disabled />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label={t("column.role")}>
                <Input
                  value={convertRoleToString(Number(Context.role))}
                  name="role"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                label={t("column.password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password defaultValue={"12345678"} />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row className="btn-row">
            <Col span={10}>
              <Form.Item className="detail-btn">
                <Button>{t("button.cancel")}</Button>
                <Button
                  type="primary"
                  className="account-submit-button"
                  // onClick={handleSubmitButton}
                >
                  {t("button.save")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </div>
  );
}
