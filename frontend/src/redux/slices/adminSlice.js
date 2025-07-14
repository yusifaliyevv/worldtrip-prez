import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsers,
  deleteUser,
  setAdmin,
  getAllBookings,
  getDashboardStats,
  updateTravel,
  deleteTravel,
  removeAdmin,
  getAllTravelsAdmin,
} from "../../services/adminService";

// USERS
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  return await getAllUsers();
});

export const fetchTravelsAdmin = createAsyncThunk(
  "admin/fetchAll",
  async (params) => {
    return await getAllTravelsAdmin(params);
  }
);

export const removeUser = createAsyncThunk(
  "admin/removeUser",
  async (userId) => {
    return await deleteUser(userId);
  }
);

export const makeAdmin = createAsyncThunk("admin/makeAdmin", async (userId) => {
  return await setAdmin(userId);
});

export const takeAdmin = createAsyncThunk("admin/takeAdmin", async (userId) => {
  return await removeAdmin(userId);
});

// export const makePremium = createAsyncThunk(
//   "admin/makePremium",
//   async ({ userId, subscriptionType }) => {
//     return await setPremium(userId, subscriptionType);
//   }
// );

// BOOKINGS
export const fetchBookings = createAsyncThunk(
  "admin/fetchBookings",
  async () => {
    return await getAllBookings();
  }
);

// DASHBOARD
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async () => {
    return await getDashboardStats();
  }
);

// TRAVEL UPDATE
export const editTravel = createAsyncThunk(
  "admin/editTravel",
  async ({ id, data }) => {
    return await updateTravel(id, data);
  }
);

export const removeTravel = createAsyncThunk(
  "admin/removeTravel",
  async (id) => {
    return await deleteTravel(id);
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    bookings: [],
    dashboardStats: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.meta.arg);
      })
      .addCase(makeAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.user._id
        );
        if (index !== -1) state.users[index] = action.payload.user;
      })
      .addCase(takeAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.user._id
        );
        if (index !== -1) state.users[index] = action.payload.user;
      })
      .addCase(removeTravel.fulfilled, (state, action) => {
        console.log("Travel silindi:", action.meta.arg);
      })

      // bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
            .addCase(fetchTravelsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTravelsAdmin.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTravelsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // dashboard
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // travel edit
      .addCase(editTravel.fulfilled, (state, action) => {
        // əgər travel-ləri admin-də saxlamırsansa, sadəcə uğur mesajı alacaqsan
        console.log("Travel updated successfully", action.payload);
      });
  },
});

export default adminSlice.reducer;
