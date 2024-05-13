import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Col, Form, DatePicker, Input, Select } from "antd";
import { getCurrentTimeToString } from "../../utils/dateUtils";
import dayjs from 'dayjs';

const ModalComponent = (props, ref) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [column, setColum] = useState([]);

  const handleChangeInput = (para, value) => {
    let preState = { ...data};
    preState[para] = value;
    setData({ ...preState });
  };

  const handleSubmit = () => {
      props?.submitFunction(data);
      setIsOpen(false);
  }

  useImperativeHandle(ref, () => ({
    open: (data, colum) => {
      setIsOpen(true);
      setData(data);
      setColum(colum);
    },
  }));

  const mapOptions = (options) =>
  options
    ? options.map((option) => ({
        value: option.id,
        label: option.username || option.device_name,
      }))
    : [];

  return (
    <Modal
      title={props.title}
      open={isOpen}
      okText="Lưu"
      okType="primary"
      onOk={handleSubmit}
      cancelText="Hủy bỏ"
      onCancel={() => {
        setData([]);
        setIsOpen(false);
      }}
    >
      <br />
      {column.map((column) => (
        <Col span={22} key={column.title}>
          <Form.Item label={column.title}>
            {column.type === 'select' && (
              <Select 
                options={mapOptions(props?.select[column.dataIndex] || [])}
                allowClear
                onChange={(value) => handleChangeInput(column.dataIndex, value)}
                value={data[column.dataIndex]}
              >
              </Select>
            )}
            {column.type === "text" && (
              <Input
                name={column.dataIndex}
                value={data[column.dataIndex]}
                onChange={(e) =>
                  handleChangeInput(column.dataIndex, e.target.value)
                }
                disabled = {!column.isEdit}
              />
            )}
            {column.type === "date" && (
              <DatePicker
                format={"DD/MM/YYYY"}
                name={column.dataIndex}
                value={ dayjs(data[column.dataIndex], "DD/MM/YYYY")}
                onChange={(date, dateString) =>
                  {
                    handleChangeInput(column.dataIndex, dateString)
                  }
                }
              />
            )}
          </Form.Item>
        </Col>
      ))}
    </Modal>
  );
};

export const ModalControlData = forwardRef(ModalComponent);