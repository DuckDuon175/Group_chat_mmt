import * as React from "react";
import type { CalendarProps } from "antd";
import { Badge, Button, Calendar, ConfigProvider } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import {
  createScheduleByDoctor,
  createScheduleByPatient,
  getAllSchedules,
  getScheduleByDoctorId,
  getScheduleByPatientId,
  resetLoadCreateScheduleByDoctorStatus,
  resetLoadCreateScheduleByPatientStatus,
} from "../../redux/reducer/scheduleSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { checkDateTypeKey } from "../../utils/dateUtils";
import { ScheduleModal } from "../../components/Modal/ScheduleModal";
import {
  convertScheduleStatusToString,
  convertScheduleTypeToString,
  scheduleType,
  userRole,
} from "../../constants";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import {
  createDiagnosis,
  resetLoadCreateDiagnosisStatus,
} from "../../redux/reducer/diagnosisSlice";
import { DiagnosisRequest, NotificationRequest } from "../../api";
import { ModalShowDiagnosis } from "../../components/Modal/ModalShowDiagnosis";
import { PlusOutlined } from "@ant-design/icons";
import { ModalAddSchWithDoctor } from "../../components/Modal/ModalAddSchWithDoctor";
import { ModalAddDiagnosis } from "../../components/Modal/ModalAddDiagnosis";
import { Context } from "../../utils/context";
import { ModalAddSchWithTime } from "../../components/Modal/ModalAddSchWithTime";
import { showNotiError, showNotiSuccess } from "../../components/notification";
import { createNotification } from "../../redux/reducer/notificationScheduleSlice";

type AddSchedule = {
  open: (data: any[]) => void;
};

type AddDiagnosis = {
  open: (data: any[], columns: any[]) => void;
};

type ShowDiagnosis = {
  open: (data: any[]) => void;
};

export const Schedule: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.schedule);
  const diagnosisState = useAppSelector((state) => state.diagnosis);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [data, setData] = React.useState<any[]>([]);
  const modalAddSchWithDoctorRef = React.useRef<AddSchedule>(null);
  const modalAddSchWithTimeRef = React.useRef<AddSchedule>(null);
  const modalAddDiagnosisRef = React.useRef<AddDiagnosis>(null);
  const modalShowRef = React.useRef<ShowDiagnosis>(null);

  const columns = [
    {
      title: "Thông tin chẩn đoán",
      dataIndex: "information",
      key: "information",
      type: "text",
      isEdit: true,
    },
    {
      title: "Lịch tái khám",
      dataIndex: "schedule_start_time",
      key: "schedule_start_time",
      type: "date",
      isEdit: true,
    },
    {
      title: "Loại lịch tái khám",
      dataIndex: "schedule_type_id",
      key: "schedule_type_id",
      type: "select",
      dataSelect: scheduleType,
      isEdit: true,
    },
  ];

  React.useEffect(() => {
    if (Context.role === userRole.admin) {
      dispatch(getAllSchedules());
    }
    if (Context.role === userRole.doctor) {
      dispatch(getScheduleByDoctorId());
    }
    if (Context.role === userRole.patient) {
      dispatch(getScheduleByPatientId());
    }
  }, []);

  React.useEffect(() => {
    if (dataState.loadDataStatus === ApiLoadingStatus.Success) {
      const rawData = dataState.data.map((schedule) => handleData(schedule));
      setData(rawData);
    }
    if (
      dataState.loadDataStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      setData([]);
      showNotiError(dataState.errorMessage);
    }
  }, [dataState.loadDataStatus]);

  const handleData = (data: any) => {
    const scheduleData = { ...data };
    Object.keys(data).forEach((key) => {
      if (checkDateTypeKey(key)) {
        const dateObj = dayjs.unix(data[key]);
        scheduleData[key] = dateObj.format("HH:mm MM/DD/YYYY");
        scheduleData.date = dateObj.date();
        scheduleData.month = dateObj.month();
        scheduleData.year = dateObj.year();
        scheduleData.time = Number(dateObj.format("HHmm"));
      }
    });
    return scheduleData;
  };

  const getListData = (value: Dayjs) => {
    const result = value
      ? data
          .filter(
            (item) =>
              item.date === value.date() &&
              item.month === value.month() &&
              item.year === value.year()
          )
          .map((schedule) => ({
            type: schedule.status_id,
            schedule_id: schedule.id,
            session_string: `Thời gian khám: Từ ${dayjs(
              schedule.schedule_start_time
            ).format("HH:mm")} đến ${dayjs(schedule.schedule_end_time).format(
              "HH:mm"
            )}`,
            start_time: dayjs(schedule.schedule_start_time).format("HH:mm"),
            end_time: dayjs(schedule.schedule_end_time).format("HH:mm"),
            time: Number(dayjs(schedule.schedule_start_time).format("HHmm")),
            doctor: schedule.doctor_name,
            patient: schedule.patient_name,
            schedule_type: `Loại lịch hẹn: ${convertScheduleTypeToString(
              schedule.schedule_type_id
            )}`,
            status: `Trạng thái lịch hẹn: ${convertScheduleStatusToString(
              schedule.status_id
            )}`,
            doctor_id: schedule.doctor_id,
            patient_id: schedule.patient_id,
            schedule_start_time: dayjs(
              schedule.schedule_start_time,
              "HH:mm MM/DD/YYYY"
            ).unix(),
          }))
      : [];
    return result.sort((a, b) => a.time - b.time);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    if (listData.length === 0) {
      return null;
    }

    const count = {
      morning: 0,
      afternoon: 0,
      evening: 0,
    };

    listData.forEach((item) => {
      const time = item.time;
      if (time < 1200) {
        count.morning++;
      } else if (time >= 1200 && time < 1900) {
        count.afternoon++;
      } else {
        count.evening++;
      }
    });

    return (
      <ul className="events">
        <Badge color={"orange"} text={`Số ca sáng: ${count.morning}`} />
        <Badge color={"green"} text={`Số ca chiều: ${count.afternoon}`} />
        <Badge color={"purple"} text={`Số ca tối: ${count.evening}`} />
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const onDateSelect = (value: Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === "date") {
      setSelectedDate(value);
      setIsOpen(true);
    }
  };

  const handleSubmitAddScheduleFunction = (data: any) => {
    dispatch(createScheduleByPatient(data));
    dispatch(
      createNotification({
        ...data,
      } as NotificationRequest)
    );
  };

  const handleSubmitAddDiagnosisFunction = (data: any) => {
    dispatch(
      createDiagnosis({
        schedule_id: data.schedule_id,
        information: data.information,
      } as DiagnosisRequest)
    );
    if (
      data.schedule_start_time !== null &&
      data.schedule_start_time !== undefined
    ) {
      dispatch(createScheduleByDoctor(data));
      dispatch(
        createNotification({
          ...data,
        } as NotificationRequest)
      );
    }
  };

  React.useEffect(() => {
    if (diagnosisState.loadCreateDiagnosisStatus === ApiLoadingStatus.Success) {
      dispatch(resetLoadCreateDiagnosisStatus());
      showNotiSuccess("Bạn đã tạo chẩn đoán thành công");
    }
    if (
      diagnosisState.loadCreateDiagnosisStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      dispatch(resetLoadCreateDiagnosisStatus());
      showNotiError(dataState.errorMessage);
    }
  }, [diagnosisState.loadCreateDiagnosisStatus]);

  React.useEffect(() => {
    if (
      dataState.loadCreateScheduleByDoctorStatus === ApiLoadingStatus.Success
    ) {
      showNotiSuccess("Bạn đã tạo lịch hẹn thành công");
      dispatch(resetLoadCreateScheduleByDoctorStatus());
      dispatch(getScheduleByDoctorId());
    }
    if (
      dataState.loadCreateScheduleByDoctorStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadCreateScheduleByDoctorStatus());
    }
  }, [dataState.loadCreateScheduleByDoctorStatus]);

  React.useEffect(() => {
    if (
      dataState.loadCreateScheduleByPatientStatus === ApiLoadingStatus.Success
    ) {
      showNotiSuccess("Bạn đã đặt lịch hẹn thành công");
      dispatch(resetLoadCreateScheduleByPatientStatus());
      dispatch(getScheduleByPatientId());
    }
    if (
      dataState.loadCreateScheduleByPatientStatus === ApiLoadingStatus.Failed &&
      dataState.errorMessage
    ) {
      showNotiError(dataState.errorMessage);
      dispatch(resetLoadCreateScheduleByPatientStatus());
    }
  }, [dataState.loadCreateScheduleByPatientStatus]);

  return (
    <>
      {Context.role === userRole.patient && (
        <>
          {" "}
          <Button
            icon={<PlusOutlined />}
            onClick={() => modalAddSchWithDoctorRef.current?.open({} as any)}
            style={{ marginRight: "8px" }}
          >
            Đặt lịch khám theo bác sĩ
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => modalAddSchWithTimeRef.current?.open({} as any)}
          >
            Đặt lịch khám theo thời gian
          </Button>{" "}
        </>
      )}
      <ConfigProvider locale={viVN}>
        <Calendar cellRender={cellRender} onSelect={onDateSelect} />
        <ScheduleModal
          title={`Lịch hẹn ngày ${selectedDate?.format("DD-MM-YYYY")}`}
          isOpen={isOpen}
          selectedDate={selectedDate}
          data={data}
          onClose={() => setIsOpen(false)}
          getListData={getListData}
          showDiagnosis={(
            schedule_id: string,
            doctor: string,
            patient: string,
            start_time: string,
            end_time: string
          ) =>
            modalShowRef.current?.open({
              schedule_id: schedule_id,
              doctor: doctor,
              patient: patient,
              start_time: start_time,
              end_time: end_time,
            } as any)
          }
          addDiagnosis={(
            selected_date: Dayjs | null,
            schedule_id: string,
            patient_id: string,
            patient: string,
            start_time: string,
            end_time: string
          ) =>
            modalAddDiagnosisRef.current?.open(
              {
                selected_date: selected_date,
                schedule_id: schedule_id,
                patient_id: patient_id,
                patient: patient,
                start_time: start_time,
                end_time: end_time,
              } as any,
              columns
            )
          }
        />
      </ConfigProvider>
      <ModalAddSchWithDoctor
        ref={modalAddSchWithDoctorRef}
        title="Đặt lịch theo bác sĩ"
        submitFunction={(data: any) => handleSubmitAddScheduleFunction(data)}
      ></ModalAddSchWithDoctor>
      <ModalAddSchWithTime
        ref={modalAddSchWithTimeRef}
        title="Đặt lịch theo thời gian"
        submitFunction={(data: any) => handleSubmitAddScheduleFunction(data)}
      ></ModalAddSchWithTime>
      <ModalAddDiagnosis
        ref={modalAddDiagnosisRef}
        title="Chẩn đoán của bác sĩ"
        submitFunction={(data: any) => handleSubmitAddDiagnosisFunction(data)}
      ></ModalAddDiagnosis>
      <ModalShowDiagnosis
        ref={modalShowRef}
        title="Xem chẩn đoán"
      ></ModalShowDiagnosis>
    </>
  );
};
