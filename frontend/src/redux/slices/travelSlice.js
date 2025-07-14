import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTravels,
  createTravel,
  getTravelById,
  deleteTravel,
  updateTravel,
} from "../../services/travelService";

export const fetchTravels = createAsyncThunk(
  "travel/fetchAll",
  async (params) => {
    return await getAllTravels(params);
  }
);

export const fetchTravel = createAsyncThunk("travel/fetchOne", async (id) => {
  return await getTravelById(id);
});

export const addTravel = createAsyncThunk("travel/add", async (data) => {
  return await createTravel(data);
});

export const removeTravel = createAsyncThunk("travel/remove", async (id) => {
  return await deleteTravel(id);
});

export const editTravel = createAsyncThunk(
  "travel/edit",
  async ({ id, data }) => {
    return await updateTravel(id, data);
  }
);

const travelSlice = createSlice({
  name: "travel",
  initialState: {
    travels: [],
    selectedTravel: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    totalCount: 0,
  },
  reducers: {
    clearSelectedTravel: (state) => {
      state.selectedTravel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTravels.fulfilled, (state, action) => {
        state.travels = action.payload.travels;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.isLoading = false;
      })

      .addCase(fetchTravels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTravel.fulfilled, (state, action) => {
        state.selectedTravel = action.payload;
      })
      .addCase(addTravel.fulfilled, (state, action) => {
        state.travels.push(action.payload);
      })
      .addCase(removeTravel.fulfilled, (state, action) => {
        state.travels = state.travels.filter((t) => t._id !== action.meta.arg);
      })
      .addCase(editTravel.fulfilled, (state, action) => {
        const index = state.travels.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.travels[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedTravel } = travelSlice.actions;
export default travelSlice.reducer;
