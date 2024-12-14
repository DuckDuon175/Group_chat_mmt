import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { DrawerSide } from "../../components/Drawer/Drawer";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider } from "antd";

const UserDetailComponent = (props: any, ref: any) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>([]);
  const [idSelect, setIdSelect] = React.useState<string>("");
  const dataState = useAppSelector((state) => state.user);

  React.useEffect(() => {
    if (dataState.loadGetUserByIdStatus === ApiLoadingStatus.Success) {
      setData(dataState.userData);
    }
  }, [dataState.loadGetUserByIdStatus]);

  const labelsInfo = {
    username: "Tên nguời dùngdùng",
    gender: "Giới tính",
    birth: "Ngày sinh",
    phone_number: "Số điện thoại",
  };

  const customData = (
    <>
      <Avatar size={60} icon={<UserOutlined />} />
      <p className="site-description-item-profile-p">Thông tin cụ thể</p>
      <p className="site-description-item-profile-wrapper">
        {data.information}
      </p>
      <Divider />
    </>
  );

  return (
    <>
      <DrawerSide
        closed={() => {
          setIsOpen(false);
          setData([]);
        }}
        isOpen={isOpen}
        title="Thông tin người dùng"
        data={data}
        labels={labelsInfo}
        customData={customData}
      />
    </>
  );
};

export const UserDetail = React.forwardRef(UserDetailComponent);
