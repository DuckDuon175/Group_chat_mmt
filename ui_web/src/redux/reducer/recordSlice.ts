import { createSlice } from "@reduxjs/toolkit";
import { RecordRequest, RecordResponse } from "../../api/api-generated";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap } from "../handler";
import { Service } from "../../api";

interface IRecordState {
  data: RecordResponse[];
  recordData: RecordResponse;
  loadDataStatus: ApiLoadingStatus;
  loadGetRecordByIdStatus: ApiLoadingStatus;
  loadUpdateDataStatus: ApiLoadingStatus;
  loadDeleteDataStatus: ApiLoadingStatus;
}

const initialState: IRecordState = {
  data: [],
  recordData: {} as RecordResponse,
  loadDataStatus: ApiLoadingStatus.None,
  loadGetRecordByIdStatus: ApiLoadingStatus.None,
  loadUpdateDataStatus: ApiLoadingStatus.None,
  loadDeleteDataStatus: ApiLoadingStatus.None,
};

export const getAllRecord = createAsyncThunkWrap("/record", async () => {
  return await Service.recordService.getAllRecord();
});

export const getRecordById = createAsyncThunkWrap(
  "/record/id",
  async (id: string) => {
    return await Service.recordService.getRecordById(id);
  }
);

export const updateRecordById = createAsyncThunkWrap(
  "/update",
  async (record: RecordRequest) => {
    return await Service.recordService.updateRecordById(record);
  }
);

export const deleteRecordById = createAsyncThunkWrap(
  "/delete",
  async (id: string) => {
    return await Service.recordService.deleteRecordById(id);
  }
);

export const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    resetLoadDataStatus: (state) => {
      state.loadDataStatus = ApiLoadingStatus.None;
    },
    resetLoadGetRecordByIdStatus: (state) => {
      state.loadGetRecordByIdStatus = ApiLoadingStatus.None;
    },
    resetLoadUpdateDataStatus: (state) => {
      state.loadUpdateDataStatus = ApiLoadingStatus.None;
    },
    resetLoadDeleteDataStatus: (state) => {
      state.loadDeleteDataStatus = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecord.pending, (state, action) => {
        state.loadDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getAllRecord.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(getAllRecord.rejected, (state, action) => {
        state.data = [];
        state.loadDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(getRecordById.pending, (state, action) => {
        state.loadGetRecordByIdStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getRecordById.fulfilled, (state, action) => {
        state.recordData = action.payload;
        state.loadGetRecordByIdStatus = ApiLoadingStatus.Success;
      })
      .addCase(getRecordById.rejected, (state, action) => {
        state.recordData = {} as RecordResponse;
        state.loadGetRecordByIdStatus = ApiLoadingStatus.Failed;
      })
      .addCase(updateRecordById.pending, (state, action) => {
        state.loadUpdateDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(updateRecordById.fulfilled, (state, action) => {
        state.loadUpdateDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(updateRecordById.rejected, (state, action) => {
        state.loadUpdateDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(deleteRecordById.pending, (state, action) => {
        state.loadDeleteDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(deleteRecordById.fulfilled, (state, action) => {
        state.loadDeleteDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(deleteRecordById.rejected, (state, action) => {
        state.loadDeleteDataStatus = ApiLoadingStatus.Failed;
      });
  },
});

export const {
  resetLoadDataStatus,
  resetLoadGetRecordByIdStatus,
  resetLoadUpdateDataStatus,
  resetLoadDeleteDataStatus,
} = recordSlice.actions;
export default recordSlice.reducer;
