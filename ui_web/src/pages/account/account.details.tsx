import React, { useState, useEffect } from "react";
import { Row, Col, Image, Form, Input, DatePicker, Button } from "antd";
import avatarDemo from "../../assets/avatar.svg";
import dayjs from "dayjs";
import "./account.details.scss";

export function Detail() {
  const [form] = Form.useForm();

  useEffect(() => {
    const localStorageData = localStorage.getItem("ui-context");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);

      form.setFieldsValue({
        username: parsedData.username,
        gender: parsedData.gender === 1 ? "Nam" : "Nữ",
        phone_number: parsedData.phone_number,
        birth: dayjs(parsedData.birth * 1000),
        email: parsedData.email,
        information: parsedData.information,
      });
    }
  }, [form]);

  const handleSave = () => {
    alert("Cập nhật thành công!");
  };

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
        </Row>
        <br />
        <Form layout="vertical" form={form}>
          <Row>
            <Col span={10}>
              <Form.Item label={"Họ và tên"} name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label={"Giới tính"} name="gender">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label={"Số điện thoại"} name="phone_number">
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label={"Ngày sinh"} name="birth">
                <DatePicker format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label="Thông tin" name="information">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row className="btn-row">
            <Col span={10}>
              <Form.Item className="detail-btn">
                <Button onClick={() => form.resetFields()}>Hủy</Button>
                <Button
                  type="primary"
                  className="account-submit-button"
                  onClick={handleSave}
                >
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </div>
  );
}
