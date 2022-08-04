import { createStore, applyMiddleware, combineReducers, Action } from "redux";
import thunk, {
  ThunkAction,
  ThunkDispatch,
  ThunkMiddleware,
} from "redux-thunk";
import alertsReducer from "./alerts/alertsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import productsReducer from "./products/productsReducer";
import topicsReducer from "./topics/topicsReducer";
import remotecisReducer from "./remotecis/remotecisReducer";
import feedersReducer from "./feeders/feedersReducer";
import teamsReducer from "./teams/teamsReducer";
import usersReducer from "./users/usersReducer";
import jobsReducer from "./jobs/jobsReducer";
import pipelinesReducer from "./pipelines/pipelinesReducer";

export const rootReducer = combineReducers({
  alerts: alertsReducer,
  currentUser: currentUserReducer,
  jobs: jobsReducer,
  pipelines: pipelinesReducer,
  products: productsReducer,
  topics: topicsReducer,
  feeders: feedersReducer,
  remotecis: remotecisReducer,
  teams: teamsReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<R = void> = ThunkAction<R, RootState, null, Action>;
export type AppDispatch = ThunkDispatch<RootState, null, Action>;

const middleware: ThunkMiddleware<RootState, Action> = thunk;

const store = createStore(rootReducer, applyMiddleware(middleware));

export default store;
