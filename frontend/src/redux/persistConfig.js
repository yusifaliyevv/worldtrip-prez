import storage from "redux-persist/lib/storage";

export const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};