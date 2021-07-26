import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import rootReducer from "./reducers";
import { all, fork } from 'redux-saga/effects';
import sessionSaga from '@redux/features/session/saga'

const sagaMiddleware = createSagaMiddleware();
function* rootSaga() {
    yield all([
        fork(sessionSaga)
    ])
}
    
const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware]
});

sagaMiddleware.run(rootSaga);


export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
