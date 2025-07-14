import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCheckoutSession } from "../../services/paymentService";

export const startCheckout = createAsyncThunk(
  "payment/startCheckout",
  async ({ bookingCode, userId }, thunkAPI) => {
    try {
      return await createCheckoutSession(bookingCode, userId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Ödəniş xətası");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    isLoading: false,
    sessionId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startCheckout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startCheckout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionId = action.payload.id;
      })
      .addCase(startCheckout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
