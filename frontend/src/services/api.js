import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend URL-in
  withCredentials: true, // cookie üçün
});

export default api;
