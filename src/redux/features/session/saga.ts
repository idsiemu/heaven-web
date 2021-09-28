import { all, call, fork, put, take } from 'redux-saga/effects';
import { requestKakaoLogin, sessionInit } from './api';
import { sessionAction } from './slice';
import { useCookie } from "next-cookie";
import { REFRESH_TOKEN, TOKEN } from 'src/assets/utils/ENV';


function* watchSessionSaga() {
    yield all([
        fork(kakaoSaga),
        fork(initialSaga),
    ]);
}

function* initialSaga() {
    while(true) {
        yield take(sessionAction.initialRequest)
        const { data } = yield call(sessionInit)
        yield put(sessionAction.initialSuccess(data.session.session))
    }
}

function* kakaoSaga() {
    while(true){
        const {payload} = yield take(sessionAction.kakaoRequest)
        const { data: {kakaoLogin} } = yield call(requestKakaoLogin, payload)
        if(kakaoLogin.status === 200){
            const cookie = useCookie();
            cookie.set(TOKEN, kakaoLogin[TOKEN], { path: '/' })
            cookie.set(REFRESH_TOKEN, kakaoLogin[REFRESH_TOKEN], { path: '/' })
            yield put(sessionAction.loginSuccess({session : kakaoLogin.session, location : kakaoLogin.location}))
        }else{
            yield put(sessionAction.loginFailure({status: kakaoLogin.status, errors : kakaoLogin.errors}))
        }
    }
}

export default watchSessionSaga