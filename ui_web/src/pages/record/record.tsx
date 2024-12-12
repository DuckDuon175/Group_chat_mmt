import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import DataTable from "../../components/Table/dataTable";
import { ModalControlData } from "../../components/Modal/ModalControlData";
import { RecordDetail } from "./record.details";
import {
  getAllRecord,
  updateRecordById,
  deleteRecordById,
  resetLoadDeleteDataStatus,
  resetLoadUpdateDataStatus,
  getRecordByDoctorId,
  getRecordByPatientId,
} from "../../redux/reducer/recordSlice";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { convertTimeToDateTime, checkDateTypeKey } from "../../utils/dateUtils";
import { findElementById } from "../../utils/arrayUtils";
import dayjs from "dayjs";
import { Context } from "../../utils/context";
import { userRole } from "../../constants";
import { showNotiError, showNotiSuccess } from "../../components/notification";

type RecordDetailType = {
  open: (id: string) => void;
};

type EditRecordType = {
  open: (data: any[], columns: any[], layout: any) => void;
};

export const Record: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.record);
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [selectedData, setSelectedData] = React.useState<any[]>([]);
  const drawerRef = React.useRef<RecordDetailType>(null);
  const modalUpdateRef = React.useRef<EditRecordType>(null);

  const columns = [
    {
      title: "Tên bản ghi",
      dataIndex: "data_rec_url",
      key: "data_rec_url",
      type: "text",
      isEdit: false,
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patient",
      key: "patient",
      type: "text",
      isEdit: false,
      hidden: Context.role === userRole.patient,
    },
    {
      title: "Tên bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
      type: "text",
      isEdit: false,
      hidden: Context.role === userRole.doctor,
    },
    {
      title: "Tên thiết bị",
      dataIndex: "device_name",
      key: "device_name",
      type: "text",
      isEdit: false,
    },
    {
      title: "ID lịch khám",
      dataIndex: "schedule_id",
      key: "schedule_id",
      type: "select",
      isEdit: false,
      hidden: true,
    },
    {
      title: "Thời gian bắt đầu phiên đo",
      dataIndex: "start_time",
      key: "start_time",
      type: "time",
      isEdit: true,
    },
    {
      title: "Thời gian kết thúc phiên đo",
      dataIndex: "end_time",
      key: "end_time",
      type: "time",
      isEdit: true,
    },
  ];

  const handleData = (data: any, type: string) => {
    let recordData = {} as any;

    if (type === "edit-form") {
      recordData = {
        ...data,
      };
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          recordData[key] = dayjs(data[key], "HH:mm DD/MM/YYYY");
        }
      });
    }

    if (type === "render") {
      recordData = {
        ...data,
      };
      Object.keys(data).forEach((key) => {
        if (checkDateTypeKey(key)) {
          recordData[key] = convertTimeToDateTime(data[key]);
        }
      });
    }

    return recordData;
  };

  React.useEffect(() => {
    if (Context.role === userRole.admin) {
      dispatch(getAllRecord());
    }
    if (Context.role === userRole.doctor) {
      dispatch(getRecordByDoctorId());
    }
    if (Context.role === userRole.patient) {
      dispatch(getRecordByPatientId());
    }
  }, []);

  // Get data
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
    if (dataState.loadUpdateDataStatus === ApiLoadingStatus.Success) {
      dispatch(resetLoadUpdateDataStatus());
      dispatch(getRecordByDoctorId());
      showNotiSuccess("Bạn đã sửa bản ghi thành công");
    }
    if (
      dataState.loadUpdateDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadUpdateDataStatus());
    }
  }, [dataState.loadUpdateDataStatus]);

  React.useEffect(() => {
    if (dataState.loadDeleteDataStatus === ApiLoadingStatus.Success) {
      dispatch(resetLoadDeleteDataStatus());
      dispatch(getRecordByDoctorId());
      showNotiSuccess("Bạn đã xoá bản ghi thành công");
    }
    if (
      dataState.loadDeleteDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadDeleteDataStatus());
    }
  }, [dataState.loadDeleteDataStatus]);

  const handleEditFunction = () => {
    const deviceData = findElementById(dataTable, selectedData[0]);
    const dataEdit = handleData(deviceData, "edit-form");
    modalUpdateRef.current?.open(dataEdit, columns, "horizontal");
  };

  const handleSubmitEditDevice = (data: any) => {
    const { ...payload } = data;
    dispatch(updateRecordById(payload));
  };

  const handleDeleteFunction = (id: string) => {
    dispatch(deleteRecordById(id));
  };

  return (
    <>
      <DataTable
        role={Context.role === userRole.doctor ? userRole.doctor : undefined}
        editButton={Context.role === userRole.doctor}
        deleteButton={Context.role === userRole.doctor}
        column={columns}
        name="Thông tin bản ghi"
        data={dataTable}
        loading={dataState.loadDataStatus === ApiLoadingStatus.Loading}
        updateSelectedData={setSelectedData}
        editFunction={handleEditFunction}
        deleteFunction={handleDeleteFunction}
        handleOpenDrawer={(id) => drawerRef.current?.open(id)}
      />
      <ModalControlData
        ref={modalUpdateRef}
        title="Sửa thông tin thiết bị"
        submitFunction={(data: any) => handleSubmitEditDevice(data)}
      />
      <RecordDetail ref={drawerRef} />
    </>
  );
};
