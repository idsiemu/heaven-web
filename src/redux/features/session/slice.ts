import { IError } from '@interfaces';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISessionState {
    initial: boolean;
    loading: boolean;
    location: string | null;
    session: ISession | null;
    errors: IError[] | null;
    snack : IError[] | null;
};

export interface IRegisterPayload {
    id : string;
    group_name? : string;
    name : string;
    phone? : string;
    password : string;
    confirm : string;
    role? : number;
    device: 'WEB';
}

export interface IKakaoPayload {
    access_token: string
    refresh_token: string
    device: string
}

export interface ISessionAvatar {
    domain: string,
    file_serial: string,
    origin: string,
    xl_size: string | null,
    l_size: string | null,
    m_size: string | null,
    s_size: string | null,
    ss_size: string | null
}
export interface ISessionRole {
    role_idx: number
}
export interface ISession {
    idx: number;
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    image: Array<ISessionAvatar>;
    role: Array<ISessionRole>;
}

const initialState: ISessionState = {
    initial: true,
    loading: false,
    session: null,
    location: null,
    errors : null,
    snack: null
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        initialRequest : (state) => {
            state.initial = true;
        },
        initialSuccess : (state, { payload }: PayloadAction<{session : ISession, location : null | string}>) => {
            state.initial = false;
            state.session = payload.session
            state.location = payload.location
        },
        kakaoRequest: (state, _action: PayloadAction<IKakaoPayload>) => {
            state.loading = true;
            state.errors = null
        },
        loginSuccess: (state, { payload }: PayloadAction<{session : ISession, location : null | string}>) => {
            state.loading = false
            state.session = payload.session
            state.location = payload.location
            state.errors = null
            state.snack = null
        },
        loginFailure: (state, { payload }: PayloadAction<{status : number, errors : IError[]}>) => {
            state.loading = false;
            if(payload.status === 400){
                state.errors = payload.errors
            }else {
                state.snack = payload.errors
            }
        },
        logoutRequest:(state, _action:PayloadAction<{idx : number}>) => {
            state.loading = true;
        },
        logoutSuccess:(state) => {
            state.loading = true;
            state.session = null
        },
        logoutFailure: (state, { payload }: PayloadAction<IError[]>) => {
            state.loading = false;
            state.errors = payload
        },
        clearError: (state) => {
            state.errors = null
            state.snack = null
        },
        setPhone: (state, { payload }: PayloadAction<string|null>) => {
            if(state.session){
                state.session.phone = payload ? payload : undefined
            }
        },
        setLocation: (state, { payload }: PayloadAction<string|null>) => {
            state.location = payload
        },
        setSnack: (state, { payload }: PayloadAction<IError[]| null>) => {
            state.snack = payload
        },
        setAvatar: (state, { payload }: PayloadAction<Array<ISessionAvatar>>) => {
            if(state.session){
                state.session.image = payload
            }
        },
        setRole: (state, { payload }: PayloadAction<Array<ISessionRole>>) => {
            if(state.session){
                state.session.role = payload
            }
        },
        setName: (state, { payload }: PayloadAction<string|null>) => {
            if(state.session){
                state.session.name = payload ? payload : undefined
            }
        },
    },
});

export const selectSession = createSelector(
    (state:ISession) => state,
    (state) => {
        return state;
    }
);
    
export const SESSION = sessionSlice.name;
export const sessionReducer = sessionSlice.reducer;
export const sessionAction = sessionSlice.actions;