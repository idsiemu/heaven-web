import { all, call, fork, put, take } from 'redux-saga/effects';
import { requestLogin, requestRegister, sessionInit } from './api';
import { sessionAction } from './slice';
import { useCookie } from "next-cookie";
import { REFRESH_TOKEN, TOKEN } from 'src/assets/utils/ENV';


function* watchSessionSaga() {
    yield all([
        fork(loginSaga),
        fork(initialSaga),
        fork(registerSaga)
    ]);
}

function* initialSaga() {
    while(true) {
        yield take(sessionAction.initialRequest)
        const { data } = yield call(sessionInit)
        console.log('session loaded')
        yield put(sessionAction.initialSuccess(data.session.session))
    }
}

function* loginSaga() {
    while(true){
        const {payload} = yield take(sessionAction.loginRequest)
        const { data: {login} } = yield call(requestLogin, payload)
        console.log('session loaded')

        if(login.status === 200){
            const cookie = useCookie();
            cookie.set(TOKEN, login[TOKEN])
            cookie.set(REFRESH_TOKEN, login[REFRESH_TOKEN])
            yield put(sessionAction.loginSuccess(login.session))
            yield put(sessionAction.setLocation(login.location))
        }else{
            yield put(sessionAction.loginFailure({status: login.status, errors : login.errors}))
        }
    }
}

function* registerSaga() {
    while(true) {
        const {payload} = yield take(sessionAction.registerRequest)
        const {data: {register}} = yield call(requestRegister, payload)
        if(register.status === 200){
            const cookie = useCookie();
            cookie.set(TOKEN, register[TOKEN])
            cookie.set(REFRESH_TOKEN, register[REFRESH_TOKEN])
            yield put(sessionAction.registerSuccess(register.session))
            yield put(sessionAction.setLocation(register.location))
        }else{
            yield put(sessionAction.registerFailure({status: register.status, errors : register.errors}))
        }
    }
}

export default watchSessionSaga