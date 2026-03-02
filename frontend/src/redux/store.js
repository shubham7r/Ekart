import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

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
import storage from "redux-persist/lib/storage";

/* persist config */
const persistConfig = {
  key: "Ekart",
  version: 1,
  storage,
};

/* root reducer */
const rootReducer = combineReducers({
  user: userSlice,
});

/* persisted reducer */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* store */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/* persistor */
export const persistor = persistStore(store);

export default store;
