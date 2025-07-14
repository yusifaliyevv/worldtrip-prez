import api from './api';

// Register (multipart/form-data)
export const register = async (formData) => {
  const res = await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
  return res.data;
};

// Login
export const login = async (data) => {
  const res = await api.post('/auth/login', data, { withCredentials: true });
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post('/auth/logout', {}, { withCredentials: true });
  return res.data;
};

// Email verify
export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify?token=${token}`);
  return res.data;
};

// Update profile
export const updateProfile = async (formData) => {
  const res = await api.put('/auth/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
  return res.data;
};

// Forgot password
export const forgotPassword = async (data) => {
  const res = await api.post('/auth/forgotpassword', data);
  return res.data;
};

// Reset password
export const resetPassword = async (data) => {
  const res = await api.post('/auth/resetpassword', data, { withCredentials: true });
  return res.data;
};
