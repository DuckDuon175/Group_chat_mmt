import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import DataTable from "../../components/Table/dataTable";
import { ApiLoadingStatus } from "../../utils/loadingStatus";

type UserDetailType = {
  open: (id: string) => void;
};

type EditUserType = {
  open: (data: any[], columns: any[], layout: any) => void;
};

export const User: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.user);
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [selectedData, setSelectedData] = React.useState<any[]>([]);
  const drawerRef = React.useRef<UserDetailType>(null);
  const modalUpdateRef = React.useRef<EditUserType>(null);
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      type: "text",
      isEdit: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      type: "select",
      isEdit: true,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth",
      key: "birth",
      type: "date",
      isEdit: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      type: "text",
      isEdit: true,
    },
  ];


  React.useEffect(() => {
    
  }, []);

  // Get data
  React.useEffect(() => {
    if (dataState.loadDataStatus === ApiLoadingStatus.Success) {
      setDataTable(dataState.data);
    }
  }, [dataState.loadDataStatus]);

  return (
    <>
      <DataTable
        column={columns}
        data={dataTable}
        loading={dataState.loadDataStatus === ApiLoadingStatus.Loading}
        updateSelectedData={setSelectedData}
      />
    </>
  );
};
