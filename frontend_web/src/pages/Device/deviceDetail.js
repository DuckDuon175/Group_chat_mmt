import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { checkDateTypeKey } from "../../utils/arrayUtils";
import { convertTimeToDate } from "../../utils/dateUtils";
import { DrawerSide } from "../../components/Drawer/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceById, loadStatus } from "../../redux/reducer/deviceSlice";
import { Divider, Table } from "antd";
import { convertDeviceStatusToString } from "../../constants";

const DeviceDetailComponent = (props, ref) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [idSelect, setIdSelect] = useState("");

  const { deviceData, loadDeviceDataStatus } = useSelector(
    (state) => state.device
  );
  const handleConnectionData = (data) => {
    if (data) {
      return data.map((item, index) => {
        return { ...item, delay: index % 2 == 0 ? "2ms" : "1ms" };
      });
    }
  };
  const handleData = (data) => {
    const deviceData = {
      ...data,
      status: convertDeviceStatusToString(data.status),
      connection: handleConnectionData(data.connection),
    };

    Object.keys(data).forEach((key) => {
      if (checkDateTypeKey(key)) {
        deviceData[key] = convertTimeToDate(data[key]);
      }
    });

    return deviceData;
  };

  useImperativeHandle(ref, () => ({
    open: (id) => {
      setIsOpen(true);
      if (id !== idSelect) {
        setIdSelect(id);
        dispatch(getDeviceById(id));
      }
    },
  }));

  useEffect(() => {
    if (loadDeviceDataStatus === loadStatus.Success) {
      const rawData = deviceData.metadata;
      setData(handleData(rawData));
    }
  }, [loadDeviceDataStatus]);

  const labelsInfo = {
    device_name: "Tên thiết bị",
    device_type: "Loại thiết bị",
    frequency: "Tần số",
    storage: "Lưu trữ dữ liệu",
    connection: "Phương thức kết nối",
    recordCount: "Số bản ghi",
    status: "Trạng thái",
    start_date: "Ngày bắt đầu",
  };

  const frequencyColumns = [
    {
      title: "Thông tin",
      dataIndex: "information",
      key: "information",
    },
    {
      title: "Tần số lấy mẫu (Hz)",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Cảm biến",
      dataIndex: "detail_name",
      key: "detail_name",
    },
  ];

  const storageColumns = [
    {
      title: "Thông tin",
      dataIndex: "information",
      key: "information",
    },
    {
      title: "Dung lượng",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Lưu trữ",
      dataIndex: "detail_name",
      key: "detail_name",
    },
  ];
  const connectionColumns = [
    {
      title: "Tần số kết nối (Hz)",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Kết nối",
      dataIndex: "detail_name",
      key: "detail_name",
    },
    { title: "Độ trễ", dataIndex: "delay", key: "delay" },
    {
      title: "Thông tin",
      dataIndex: "information",
      key: "information",
    },
  ];
  const customDetail = {
    frequency: (
      <Table
        columns={frequencyColumns}
        dataSource={data.frequency}
        pagination={false}
      />
    ),
    storage: (
      <Table
        columns={storageColumns}
        dataSource={data.storage}
        pagination={false}
      />
    ),
    connection: (
      <Table
        columns={connectionColumns}
        dataSource={data.connection}
        pagination={false}
      />
    ),
  };

  const customData = (
    <>
      <p className="site-description-item-profile-p">Thông tin cụ thể</p>
      <p className="site-description-item-profile-wrapper">
        {data?.information}
      </p>
      <Divider />
    </>
  );

  return (
    <>
      <DrawerSide
        closed={() => setIsOpen(false)}
        isOpen={isOpen}
        title="Thông tin thiết bị"
        data={data}
        labels={labelsInfo}
        customData={customData}
        customDetail={customDetail}
      />
    </>
  );
};

export const DeviceDetail = forwardRef(DeviceDetailComponent);
