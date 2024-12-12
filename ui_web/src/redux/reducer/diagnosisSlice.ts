import { createSlice } from "@reduxjs/toolkit";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap } from "../handler";
import { DiagnosisRequest, DiagnosisResponse, Service } from "../../api";

interface IScheduleState {
  diagnosis: DiagnosisResponse;
  loadCreateDiagnosisStatus: ApiLoadingStatus;
  loadGetDiagnosisByScheduleIdStatus: ApiLoadingStatus;
  errorMessage: string | undefined;
}

const initialState: IScheduleState = {
  diagnosis: {} as DiagnosisResponse,
  loadCreateDiagnosisStatus: ApiLoadingStatus.None,
  loadGetDiagnosisByScheduleIdStatus: ApiLoadingStatus.None,
  errorMessage: undefined,
};

export const createDiagnosis = createAsyncThunkWrap(
  "/diagnosis/create",
  async (diagnosis: DiagnosisRequest) => {
    return await Service.diagnosisService.createDiagnosis(diagnosis);
  }
);

export const getDiagnosisByScheduleId = createAsyncThunkWrap(
  "/diagnosis/schedule",
  async (schedule_id: string) => {
    return await Service.diagnosisService.getDiagnosisByScheduleId(schedule_id);
  }
);

export const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    resetLoadCreateDiagnosisStatus: (state) => {
      state.loadCreateDiagnosisStatus = ApiLoadingStatus.None;
    },
    resetLoadGetDiagnosisByScheduleIdStatus: (state) => {
      state.loadGetDiagnosisByScheduleIdStatus = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiagnosis.pending, (state, action) => {
        state.loadCreateDiagnosisStatus = ApiLoadingStatus.Loading;
      })
      .addCase(createDiagnosis.fulfilled, (state, action) => {
        state.loadCreateDiagnosisStatus = ApiLoadingStatus.Success;
      })
      .addCase(createDiagnosis.rejected, (state, action) => {
        state.errorMessage = (<any>action.payload)?.message;
        state.loadCreateDiagnosisStatus = ApiLoadingStatus.Failed;
      })
      .addCase(getDiagnosisByScheduleId.pending, (state, action) => {
        state.loadGetDiagnosisByScheduleIdStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getDiagnosisByScheduleId.fulfilled, (state, action) => {
        state.diagnosis = action.payload;
        state.loadGetDiagnosisByScheduleIdStatus = ApiLoadingStatus.Success;
      })
      .addCase(getDiagnosisByScheduleId.rejected, (state, action) => {
        state.diagnosis = {} as DiagnosisResponse;
        state.errorMessage = (<any>action.payload)?.message;
        state.loadGetDiagnosisByScheduleIdStatus = ApiLoadingStatus.Failed;
      });
  },
});

export const { resetLoadCreateDiagnosisStatus, resetLoadGetDiagnosisByScheduleIdStatus } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;
