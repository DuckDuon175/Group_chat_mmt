import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/Table/dataTable";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createRecord,
  deleteRecord,
  getRecord,
  resetCreateDataStatus,
  resetDeleteDataStatus,
  resetUpdateDataStatus,
  updateRecord,
  loadStatus,
  resetLoadDataStatus,
  checkRecordFile,
  resetCheckRecordStatus,
  downloadRecordFile
} from "../../redux/reducer/recordSlice";
import { convertDateToTime, convertTimeToDateTime } from "../../utils/dateUtils";
import { findElementById, checkDateTypeKey } from "../../utils/arrayUtils";
import { showNotiSuccess } from "../../components/Notification";
import { getLocalStorage } from "../../utils/storageUtils";
import ModalChart from "../../components/Modal/ModalChart";
import { Button, Input, Space, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { httpGetData } from "../../api/common.api";
import { ModalControlData } from "../../components/Modal/ModalControlData";
import { CloudDownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DrawerSide } from "../../components/Drawer/Drawer";
import { RecordDetail } from "./recordDetail";

const RecordTable = () => {
  const dispatch = useDispatch();
  const dataState = useSelector((state) => state.record);
  const [selectedData, setSelectedData] = useState([]);
  const [dataTable, setData] = useState([]);
  const [openChart, setOpenChart] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dropdownData, setDropData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInput = useRef(null);
  const modalUpdateRef = useRef(null);
  const modalAddRef = useRef(null);
  const user_id = getLocalStorage("user");
  const drawerRef = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? text : text),
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      isEdit: false,
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_id",
      key: "user_id",
      type: "select",
      dataSelect: dropdownData.user,
      isEdit: true,
      hidden: true,
    },
    {
      title: "Tên thiết bị",
      dataIndex: "device_name",
      key: "device_name",
      isEdit: false,
    },
    {
      title: "Tên thiết bị",
      dataIndex: "device_id",
      key: "device_id",
      type: "select",
      dataSelect: dropdownData.device,
      isEdit: true,
      hidden: true,
    },
    {
      title: "Loại bản ghi",
      dataIndex: "record_type",
      key: "record_type",
      type: "text",
      isEdit: true,
      ...getColumnSearchProps("record_type", "loại bản ghi"),
    },
    {
      title: "Tên bản ghi",
      dataIndex: "record_name",
      key: "record_name",
      type: "text",
      isEdit: false,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      type: "time",
      isEdit: true,
      ...getColumnSearchProps("start_time", "tg bắt đầu"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      type: "time",
      isEdit: true,
      ...getColumnSearchProps("end_time", "tg kết thúc"),
    },
  ]; 

  useEffect(() => {
    dispatch(getRecord());
    const getOptionData = async () => {
      const userData = await httpGetData("/user");
      const deviceData = await httpGetData("/device");
      setDropData({
        user: userData.metadata,
        device: deviceData.metadata,
      });
    };
    getOptionData();
  }, []);

  // Get data
  useEffect(() => {
    if (dataState.loadDataStatus === loadStatus.Success) {
      const rawData = dataState.data.metadata;
      const data = rawData.map((element) => handleData(element, 'render'));
      setData(data);
    }
    dispatch(resetLoadDataStatus());
  }, [dataState.loadDataStatus]);

  useEffect(() => {
    if (dataState.loadUpdateDataStatus === loadStatus.Success) {
      showNotiSuccess("Bạn đã sửa thiết bị thành công");
      dispatch(resetUpdateDataStatus());
      dispatch(getRecord());
    }
  }, [dataState.loadUpdateDataStatus]);

  useEffect(() => {
    if (dataState.loadDeleteDataStatus === loadStatus.Success) {
      showNotiSuccess("Bạn đã xoá thiết bị thành công");
      dispatch(resetDeleteDataStatus());
      dispatch(getRecord());
    }
  }, [dataState.loadDeleteDataStatus]);

  useEffect(() => {
    if (dataState.loadCreateDataStatus === loadStatus.Success) {
      showNotiSuccess("Bạn đã thêm thiết bị thành công");
      dispatch(resetCreateDataStatus());
      dispatch(getRecord());
    }
  }, [dataState.loadCreateDataStatus]);

  const handleDeleteFunction = (id) => {
    dispatch(deleteRecord({ id: id }));
  };

  const handleEditFunction = () => {
    const rowData = findElementById(dataTable, selectedData[0]);
    const dataModal = handleData(rowData);
    modalUpdateRef.current?.open(dataModal, columns);
  };

  const handleSubmitEditUser = (data) => {
    return dispatch(updateRecord(handleData(data, 'form')));
  };

  const handleSubmitAddFunction = (data) => {
    return dispatch(createRecord(handleData(data, 'form')));
  };

  const handleData = (data, type) => {
    let deviceData = { ...data};

    if (type === 'form') {
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          deviceData[key] = dayjs(data[key], "HH:mm DD/MM/YYYY");      
        }
      });

      deviceData = {
        ...deviceData,
        user_id: user_id,
        data_rec_url: "http",
      };
    };

    if (type === 'render') {
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          deviceData[key] = convertTimeToDateTime(data[key]);      
        }
      });
    }
    return deviceData;
  };
  
  const renderDownloadButton = () => (
    <>
      {selectedData.length === 1 && (
        <>
          <Button
            icon={<CloudDownloadOutlined />}
            className="edit-btn"
            onClick={() => {
              dispatch(checkRecordFile(selectedData[0]))
              setIsModalOpen(true)
            }}
          >
            Download
          </Button>
        </>
      )}
    </>
  );

  const handleOk = () => {
    downloadRecordFile(selectedData[0]);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(resetCheckRecordStatus());
  };

  return (
    <>
      <DataTable
        editButton
        editFunction={handleEditFunction}
        addButton
        addFunction={() => modalAddRef.current?.open({}, columns)}
        deleteButton
        deleteFunction={handleDeleteFunction}
        name="Bảng quản lý record"
        data={dataTable}
        column={columns}
        updateSelectedData={setSelectedData}
        loading={dataState.loadDataStatus === loadStatus.Loading}
        chartButton
        openChart={() => setOpenChart(true)}
        customButton={renderDownloadButton()}
        handleOpenDrawer={(id) => drawerRef.current?.open(id)}
      />

      <ModalControlData
        ref={modalUpdateRef}
        title="Sửa thông tin record"
        submitFunction={(data) => handleSubmitEditUser(data)}
      />

      <ModalControlData
        ref={modalAddRef}
        title="Thêm record mới"
        submitFunction={(data) => handleSubmitAddFunction(data)}
      />

      <ModalChart
        isOpen={openChart}
        setIsOpen={setOpenChart}
        selectedDevice={selectedData}
      />

      <Modal
        title="Download record status"
        open={isModalOpen}
        onOk={handleOk}
        okText="Download"
        confirmLoading = {dataState.loadCheckRecordStatus !== loadStatus.Success}
        onCancel={handleCancel}
      >
       {dataState.loadCheckRecordStatus !== loadStatus.Success ? "Bản ghi đang được chuẩn bị để tải về... " : "Bản ghi đã sẵn sàng tải về"} 
      </Modal>

      <RecordDetail ref={drawerRef}/>
    </>
  );
};

export default RecordTable;
