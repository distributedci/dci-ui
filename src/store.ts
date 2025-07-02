import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isRejectedWithValue,
  type Middleware,
  type MiddlewareAPI,
} from "@reduxjs/toolkit";
import alertsReducer, { hideAlert, showAlert } from "./alerts/alertsSlice";
import authReducer, { loggedOut } from "./auth/authSlice";
import { api } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "./services/localStorage";
import { getAlertFromBaseQueryError } from "./services/errorHelpers";

const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

const loggedOutMiddleware = createListenerMiddleware();

loggedOutMiddleware.startListening({
  actionCreator: loggedOut,
  effect: async (_, listenerApi) => {
    removeToken();
    listenerApi.cancelActiveListeners();
  },
});

export type RootState = ReturnType<typeof rootReducer>;

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const alert = getAlertFromBaseQueryError(action.payload);
      api.dispatch(showAlert(alert));
      setTimeout(() => api.dispatch(hideAlert(alert)), 10000);
    }
    return next(action);
  };

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(api.middleware)
        .concat(loggedOutMiddleware.middleware)
        .concat(rtkQueryErrorLogger),
  });
}

export type AppStore = ReturnType<typeof setupStore>;

const store = setupStore();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
