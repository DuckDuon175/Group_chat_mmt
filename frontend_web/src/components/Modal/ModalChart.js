import { Modal } from "antd";
import { useEffect, useState } from "react";
import LineChart from "../LineChart/LineChart";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataRecordById,
  loadStatus,
  resetChartRecordDataStatus,
} from "../../redux/reducer/recordSlice";
import Loading from "../Loading/Loading";

const ModalChart = ({ isOpen, setIsOpen, selectedDevice }) => {
  const [data, setData] = useState();
  const [isLoading, setIsloading] = useState(true);
  const dispatch = useDispatch();
  const dataState = useSelector((state) => state.record);

  useEffect(() => {
    if (selectedDevice.length > 0) {
      dispatch(getDataRecordById(selectedDevice?.[0]));
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (dataState.loadChartRecordDataStatus === loadStatus.Success) {
      setData(dataState.recordChartData.metadata);
      setIsloading(false);
    }
  }, [dataState.loadChartRecordDataStatus]);

  const handleCancel = () => {
    setIsOpen(false);
    dispatch(resetChartRecordDataStatus());
  };

  return (
    <>
      <Modal
        title="Đồ thị records"
        open={isOpen}
        cancelText="Quay lại"
        onCancel={handleCancel}
        width={1000}
        centered
        footer={null}
      >
        {isLoading ? <Loading /> : <LineChart rawData={data} />}
      </Modal>
    </>
  );
};
export default ModalChart;
