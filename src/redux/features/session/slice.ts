import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IError } from '../error/slice';

interface ISessionState {
    initial: boolean;
    loading: boolean;
    session: ISession | null;
    error: IError | null;
};

export interface IRegisterPayload {
    id : string;
    name : string;
    phone? : string;
    password : string;
    confirm : string;
    role? : number;
    device: 'WEB';
}
export interface ILoginPayload {
    id: string;
    password: string;
    device: 'WEB';
};

export interface ILoginSession extends ISession {
    heaven_token: string
    refersh_token: string
}

export interface ISession {
    idx: number;
    id: string;
    name: string;
    email?: string;
    phone?: string;
    
}

const initialState: ISessionState = {
    initial: true,
    loading: false,
    session: null,
    error : null
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        initialRequest : (state) => {
            state.initial = true;
        },
        initialSuccess : (state, { payload }: PayloadAction<ISession>) => {
            state.initial = false;
            state.session = payload
        },
        loginRequest: (state, _action: PayloadAction<ILoginPayload>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, { payload }: PayloadAction<ISession>) => {
            state.loading = false
            state.session = payload
        },
        loginFailure: (state, { payload }: PayloadAction<IError>) => {
            state.loading = false;
            state.error = payload
        },
        logoutRequest:(state, _action:PayloadAction<{idx : number}>) => {
            state.loading = true;
            state.error = null;
        },
        logoutSuccess:(state) => {
            state.loading = true;
            state.session = null
            state.error = null;
        },
        logoutFailure: (state, { payload }: PayloadAction<IError>) => {
            state.loading = false;
            state.error = payload
        },
        registerRequest : (state, _action:PayloadAction<IRegisterPayload>) => {
            state.loading = true
        },
        registerSuccess: (state, { payload }: PayloadAction<ISession>) => {
            state.loading = false
            state.session = payload
        },
        registerFailure: (state, { payload }: PayloadAction<IError>) => {
            state.loading = false;
            state.error = payload
        },
        clearError: (state) => {
            state.error = null
        }
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