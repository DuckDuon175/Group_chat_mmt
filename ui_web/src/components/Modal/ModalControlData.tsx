import * as React from "react";
import { Modal, Form, DatePicker, Input, Select } from "antd";
import { checkDateTypeKey, convertTimeToDate } from "../../utils/dateUtils";
import { convertGenderToString } from "../../constants"
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const ModalComponent = (props: any, ref: any) => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);
  const [column, setColumn] = React.useState<any[]>([]);
  const { t } = useTranslation();

  const handleData = (data: any) => {
    let dataSubmit = { ...data };
    Object.keys(data).forEach((key) => {
      if (checkDateTypeKey(key)) {
        dataSubmit[key] = data[key].valueOf();
      }
    });
    return dataSubmit;
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...data,
      ...handleData(values),
    };
    console.log(payload);
    const res = await props?.submitFunction(payload);
    if (!res?.error) {
      setIsOpen(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    open: (data: any, columns: any[]) => {
      setIsOpen(true);
      setData(data);
      setColumn(columns.filter((item) => item.isEdit));
      form.setFieldsValue(data);
    },
  }));

  const validateMessages = {
    required: "Đây là trường bắt buộc",
  };

  const mapOptions = (options: any[]) =>
    options
      ? options.map((option) => ({
          value: option.id || option.value,
          label: option.label || option.device_name || option.username || option.role_name,
        }))
      : [];

  return (
    <Modal
      title={props.title}
      open={isOpen}
      okText="Lưu"
      okType="primary"
      onOk={() => form.submit()}
      cancelText="Hủy bỏ"
      onCancel={() => {
        setData([]);
        setIsOpen(false);
        form.resetFields();
      }}
      className={props.className}
    >
      <br />
      <Form
        form={form}
        validateMessages={validateMessages}
        onFinish={handleSubmit}
      >
        {column.map((column) => (
          <Form.Item
            label={column.title}
            name={column.dataIndex}
            key={column.title}
            rules={[{ required: true }]}
          >
            {column.type === "select" && (
              <Select
                options={mapOptions(column.dataSelect || [])}
                allowClear
                value={data[column.dataIndex]}
              ></Select>
            )}

            {column.type === "text" && (
              <Input
                name={column.dataIndex}
                value={data[column.dataIndex]}
                disabled={!column.isEdit}
              />
            )}

            {column.type === "date" && (
              <DatePicker
                format={"DD/MM/YYYY"}
                name={column.dataIndex}
                placeholder={"Select date"}
                disabledDate={(day) => {
                  if (column.dataIndex === "end_date") {
                    const startDate = form.getFieldValue("start_date");
                    return day && day < dayjs(startDate).startOf("day");
                  }
                  return false;
                }}
              />
            )}

            {column.type === "time" && (
              <DatePicker
                showTime
                format="HH:mm DD/MM/YYYY "
                name={column.dataIndex}
                placeholder={"Select date"}
                disabledDate={(day) => {
                  if (column.dataIndex === "end_time") {
                    const startDate = form.getFieldValue("start_time");
                    return day && day < dayjs(startDate).startOf("day");
                  }
                  return false;
                }}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export const ModalControlData = React.forwardRef(ModalComponent);
