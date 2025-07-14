import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import travelReducer from "./slices/travelSlice";
import bookingReducer from "./slices/bookingSlice";
import adminReducer from "./slices/adminSlice";
import paymentReducer from "./slices/paymentSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { persistConfig } from "./persistConfig";

const persistedAuth = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuth,
    travel: travelReducer,
    booking: bookingReducer,
    admin: adminReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
