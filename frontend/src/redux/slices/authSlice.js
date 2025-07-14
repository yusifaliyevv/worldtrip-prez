import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.register(formData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.logout();
    return true;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Logout failed"
    );
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.updateProfile(formData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);


// Forgot Password
export const sendResetEmail = createAsyncThunk(
  "auth/sendResetEmail",
  async (data, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(data);
      return response.message || "Email göndərildi";
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Email göndərilə bilmədi"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, thunkAPI) => {
    try {
      const response = await authService.resetPassword(data);
      return response.message || "Şifrə yeniləndi";
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Şifrə yenilənə bilmədi"
      );
    }
  }
);


const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.existUser || action.payload.user || null;
        state.token = action.payload.token || null;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.newUser || action.payload.user || null;
        state.token = action.payload.token || null;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.success = false;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
.addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = { 
    ...state.user, 
    ...(action.payload.updatedUser || action.payload.user || {}) 
  };
  state.success = true;
})

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
            .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { resetError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
