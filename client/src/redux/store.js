import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

// 👉 Combine les reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// 👉 Configuration de redux-persist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// 👉 Applique le persistReducer correctement
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ ICI tu utilises directement le reducer persistant
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
