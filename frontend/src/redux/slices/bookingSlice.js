import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../services/bookingService.js";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (data, thunkAPI) => {
    try {
      return await bookingService.createBooking(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (_, thunkAPI) => {
    try {
      return await bookingService.getUserBookings();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (id, thunkAPI) => {
    try {
      return await bookingService.getBookingById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, data }, thunkAPI) => {
    try {
      return await bookingService.updateBooking(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (id, thunkAPI) => {
    try {
      return await bookingService.deleteBooking(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const generateBookingReceipt = createAsyncThunk(
  "booking/generateBookingReceipt",
  async (id, thunkAPI) => {
    try {
      return await bookingService.generateBookingReceipt(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// admin bookings
export const getAllBookings = createAsyncThunk(
  "booking/getAllBookings",
  async (params, thunkAPI) => {
    try {
      return await bookingService.getAllBookings(params);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    booking: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get by id
      .addCase(getBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // create booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })

      // update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.booking = action.payload.booking;
      })

      // delete booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b._id !== action.payload._id);
      })

      // admin get all
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })

      // receipt
      .addCase(generateBookingReceipt.fulfilled, (state, action) => {
        // bu response-a əsasən state-ə yazmaq olar
      });
  },
});

export default bookingSlice.reducer;
