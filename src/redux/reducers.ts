import { combineReducers } from "redux";

import {sessionReducer} from "@redux/features/session/slice"

const rootReducer = combineReducers({ sessionReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
