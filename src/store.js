import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import alertsReducer from "./alerts/alertsReducer";
import configReducer from "./config/configReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import remotecisReducer from "./remotecis/remotecisReducer";
import productsReducer from "./products/productsReducer";
import topicsReducer from "./topics/topicsReducer";
import componentsReducer from "./components/componentsReducer";
import teamsReducer from "./teams/teamsReducer";
import usersReducer from "./users/usersReducer";
import rolesReducer from "./roles/rolesReducer";
import jobsReducer from "./jobs/jobsReducer";
import globalStatusReducer from "./globalStatus/globalStatusReducer";

const store = createStore(
  combineReducers({
    alerts: alertsReducer,
    config: configReducer,
    globalStatus: globalStatusReducer,
    currentUser: currentUserReducer,
    remotecis: remotecisReducer,
    jobs: jobsReducer,
    products: productsReducer,
    topics: topicsReducer,
    components: componentsReducer,
    teams: teamsReducer,
    users: usersReducer,
    roles: rolesReducer
  }),
  applyMiddleware(thunk)
);

export default store;
