import { all, call, fork, put, take } from 'redux-saga/effects';
import { IError } from '../error/slice';
import { requestLogin, sessionInit } from './api';
import { sessionAction } from './slice';
import { useCookie } from "next-cookie";
import { REFRESH_TOKEN, TOKEN } from 'src/assets/utils/ENV';

const cookie = useCookie();

function* watchSessionSaga() {
    yield all([
        fork(loginSaga),
        fork(initialSaga)
    ]);
}

function* initialSaga() {
    while(true) {
        yield take(sessionAction.initialRequest)
        const { data } = yield call(sessionInit)
        yield put(sessionAction.initialSuccess(data.session.session))
    }
}

function* loginSaga() {
    while(true){
        const {payload} = yield take(sessionAction.loginRequest)
        const { data: {login} } = yield call(requestLogin, payload)
        if(login.status === 200){
            cookie.set(TOKEN, login[TOKEN])
            cookie.set(REFRESH_TOKEN, login[REFRESH_TOKEN])
            yield put(sessionAction.loginSuccess(login.session))
        }else{

        }
        // const action = yield take()
    }
}

export default watchSessionSaga