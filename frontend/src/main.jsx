import ReactDOM from "react-dom/client";
import router from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { ToastContainer } from "react-toastify";

import 'leaflet/dist/leaflet.css';
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </PersistGate>
  </Provider>
);