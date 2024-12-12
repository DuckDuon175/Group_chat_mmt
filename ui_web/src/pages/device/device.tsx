import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import DataTable from "../../components/Table/dataTable";
import { ModalControlData } from "../../components/Modal/ModalControlData";
import { DeviceDetail } from "./device.details";
import {
  getAllDevices,
  updateDeviceById,
  deleteDeviceById,
  resetLoadAddDataStatus,
  resetLoadUpdateDataStatus,
  resetLoadDeleteDataStatus,
  addDevice,
  deleteDeviceDetailById,
  addDeviceDetail,
  updateDeviceDetailById,
  getDeviceByDoctorId,
  resetLoadAddDetailDataStatus,
} from "../../redux/reducer/deviceSlice";
import { getAllDoctors } from "../../redux/reducer/userSlice";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { convertTimeToDate, checkDateTypeKey } from "../../utils/dateUtils";
import {
  findElementById,
  checkListTypeKey,
  checkAddedDetail,
  checkDeletedDetail,
} from "../../utils/arrayUtils";
import {
  deviceType,
  convertDeviceTypeToString,
  convertStringToDeviceType,
  deviceStatus,
  convertDeviceStatusToString,
  convertStringToDeviceStatus,
  userRole,
} from "../../constants";
import dayjs from "dayjs";
import { original } from "@reduxjs/toolkit";
import { Context } from "../../utils/context";
import { showNotiError, showNotiSuccess } from "../../components/notification";

type DeviceDetailType = {
  open: (id: string) => void;
};

type AddEditDeviceType = {
  open: (data: any[], columns: any[], layout: any) => void;
};

export const Device: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.device);
  const doctorState = useAppSelector((state) => state.user);
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [doctorDropDown, setDoctorDropDown] = React.useState<any[]>([]);
  const [selectedData, setSelectedData] = React.useState<any[]>([]);
  const [hidden, setHidden] = React.useState<boolean>(false);
  const drawerRef = React.useRef<DeviceDetailType>(null);
  const modalAddRef = React.useRef<AddEditDeviceType>(null);
  const modalUpdateRef = React.useRef<AddEditDeviceType>(null);

  const listLabel = ["detail_name", "value", "information"];

  const columns = [
    {
      title: "Tên thiết bị",
      dataIndex: "device_name",
      key: "device_name",
      type: "text",
      isEdit: true,
    },
    {
      title: "Loại thiết bị",
      dataIndex: "device_type_id",
      key: "device_type_id",
      type: "select",
      isEdit: true,
      dataSelect: deviceType,
    },
    {
      title: "Bác sĩ phụ trách",
      dataIndex: "doctor_name",
      key: "doctor_name",
      type: "select",
      isEdit: false,
      hidden: hidden,
    },
    {
      title: "Bác sĩ phụ trách",
      dataIndex: "doctor_id",
      key: "doctor_id",
      type: "select",
      isEdit: true,
      hidden: true,
      dataSelect: doctorDropDown.map((doctor) => ({
        value: doctor.id,
        label: doctor.username,
      })),
    },
    {
      title: "Trạng thái",
      dataIndex: "status_id",
      key: "status_id",
      type: "select",
      isEdit: true,
      dataSelect: deviceStatus,
    },
    {
      title: "Thông tin",
      dataIndex: "information",
      key: "information",
      type: "text",
      isEdit: true,
    },
    {
      title: "Tần số",
      dataIndex: "frequency",
      key: "frequency",
      type: "list",
      isEdit: true,
      hidden: true,
      listLabel: listLabel,
    },
    {
      title: "Phương thức kết nối",
      dataIndex: "connection",
      key: "connection",
      type: "list",
      isEdit: true,
      hidden: true,
      listLabel: listLabel,
    },
    {
      title: "Phương thức lưu trữ",
      dataIndex: "storage",
      key: "storage",
      type: "list",
      isEdit: true,
      hidden: true,
      listLabel: listLabel,
    },
    {
      title: "Ngày bắt đầu sử dụng",
      dataIndex: "start_date",
      key: "start_date",
      type: "date",
      isEdit: true,
    },
  ];

  const handleData = (data: any, type: string) => {
    let deviceData = {} as any;

    if (type === "edit-form") {
      deviceData = {
        ...data,
        status_id: convertStringToDeviceStatus(data.status_id),
        device_type_id: convertStringToDeviceType(data.device_type_id),
      };
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          deviceData[key] = dayjs(data[key], "DD/MM/YYYY");
        }
        if (checkListTypeKey(key)) {
          deviceData[key] = {
            list: data[key],
          };
        }
      });
    }

    if (type === "render") {
      deviceData = {
        ...data,
        status_id: convertDeviceStatusToString(data.status_id),
        device_type_id: convertDeviceTypeToString(data.device_type_id),
      };
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          deviceData[key] = convertTimeToDate(data[key]);
        }
      });
    }

    return deviceData;
  };

  const handleDetailChanges = (
    originalDetails: any[],
    updatedDetails: any[],
    deviceId: string,
    detailType: number
  ) => {
    if (originalDetails.length > updatedDetails.length) {
      const deletedDetails = checkDeletedDetail(
        originalDetails,
        updatedDetails
      );
      if (deletedDetails.length > 0) {
        deletedDetails.forEach((deleted) => {
          dispatch(deleteDeviceDetailById(deleted.id));
        });
      }
    }
    if (originalDetails.length < updatedDetails.length) {
      const addedDetails = checkAddedDetail(originalDetails, updatedDetails);
      if (addedDetails.length > 0) {
        addedDetails.forEach((added) => {
          added.detail_type = detailType;
          added.device_id = deviceId;
          dispatch(addDeviceDetail(added));
        });
      }
    } else if (
      JSON.stringify(originalDetails) !== JSON.stringify(updatedDetails)
    ) {
      updatedDetails.map((updated) =>
        dispatch(updateDeviceDetailById(updated))
      );
    }
  };

  React.useEffect(() => {
    if (Context.role === userRole.admin) {
      dispatch(getAllDevices());
      dispatch(getAllDoctors());
      setHidden(false);
    }
    if (Context.role === userRole.doctor) {
      dispatch(getDeviceByDoctorId());
      setHidden(true);
    }
    if (Context.role === userRole.patient) {
      dispatch(getAllDoctors());
      setHidden(false);
    }
  }, []);

  React.useEffect(() => {
    if (dataState.loadDataStatus === ApiLoadingStatus.Success) {
      const rawData = dataState.data.map((device) =>
        handleData(device, "render")
      );
      setDataTable(rawData);
    }
    if (
      dataState.loadDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
    }
  }, [dataState.loadDataStatus]);

  React.useEffect(() => {
    if (doctorState.loadDoctorDataStatus === ApiLoadingStatus.Success) {
      setDoctorDropDown(doctorState.doctorData);
    }
    if (
      doctorState.loadDoctorDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
    }
  }, [doctorState.loadDoctorDataStatus]);

  React.useEffect(() => {
    if (dataState.loadAddDataStatus === ApiLoadingStatus.Success) {
      showNotiSuccess("Bạn đã thêm thiết bị thành công");
      dispatch(resetLoadAddDataStatus());
      dispatch(getAllDevices());
    }
    if (
      dataState.loadAddDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
    }
  }, [dataState.loadAddDataStatus]);

  React.useEffect(() => {
    if (dataState.loadUpdateDataStatus === ApiLoadingStatus.Success) {
      showNotiSuccess("Bạn đã sửa thiết bị thành công");
      dispatch(resetLoadUpdateDataStatus());
      dispatch(getAllDevices());
    }
    if (
      dataState.loadUpdateDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
    }
  }, [dataState.loadUpdateDataStatus]);

  React.useEffect(() => {
    if (dataState.loadDeleteDataStatus === ApiLoadingStatus.Success) {
      showNotiSuccess("Bạn đã xóa thiết bị thành công");
      dispatch(resetLoadDeleteDataStatus());
      dispatch(getAllDevices());
    }
    if (
      dataState.loadDeleteDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
    }
  }, [dataState.loadDeleteDataStatus]);

  const handleEditFunction = () => {
    const deviceData = findElementById(dataTable, selectedData[0]);
    const dataEdit = handleData(deviceData, "edit-form");
    modalUpdateRef.current?.open(dataEdit, columns, "vertical");
  };

  const handleSubmitAddFunction = (data: any) => {
    const result = {
      ...data,
      frequency: data.frequency["list"],
      connection: data.connection["list"],
      storage: data.storage["list"],
    };
    return dispatch(addDevice(result));
  };

  const handleSubmitEditDevice = (data: any) => {
    const { ...payload } = data;
    const deviceData = findElementById(dataTable, selectedData[0]);
    handleDetailChanges(
      deviceData.frequency,
      payload.frequency["list"],
      deviceData.id,
      1
    );
    handleDetailChanges(
      deviceData.connection,
      payload.connection["list"],
      deviceData.id,
      2
    );
    handleDetailChanges(
      deviceData.storage,
      payload.storage["list"],
      deviceData.id,
      3
    );

    dispatch(updateDeviceById(payload));
  };

  const handleDeleteFunction = (id: string) => {
    dispatch(deleteDeviceById(id));
  };

  const initData: any = {
    device_name: "",
    device_type_id: "",
    doctor_id: "",
    status_id: "",
    information: "",
    frequency: {
      list: [
        {
          detail_name: "",
          value: "",
          information: "",
        },
      ],
    },
    connection: {
      list: [
        {
          detail_name: "",
          value: "",
          information: "",
        },
      ],
    },
    storage: {
      list: [
        {
          detail_name: "",
          value: "",
          information: "",
        },
      ],
    },
  };

  return (
    <>
      <DataTable
        role={Context.role === userRole.admin ? userRole.admin : undefined}
        addButton={Context.role === userRole.admin}
        editButton={Context.role === userRole.admin}
        deleteButton={Context.role === userRole.admin}
        column={columns}
        name="Thông tin thiết bị"
        data={dataTable}
        loading={dataState.loadDataStatus === ApiLoadingStatus.Loading}
        updateSelectedData={setSelectedData}
        addFunction={() =>
          modalAddRef.current?.open(initData, columns, "vertical")
        }
        editFunction={handleEditFunction}
        deleteFunction={handleDeleteFunction}
        handleOpenDrawer={(id) => drawerRef.current?.open(id)}
      />
      <ModalControlData
        ref={modalAddRef}
        title="Thêm thiết bị mới"
        submitFunction={(data: any) => handleSubmitAddFunction(data)}
        className="add-device"
      />
      <ModalControlData
        ref={modalUpdateRef}
        title="Sửa thông tin thiết bị"
        submitFunction={(data: any) => handleSubmitEditDevice(data)}
      />
      <DeviceDetail ref={drawerRef} />
    </>
  );
};
