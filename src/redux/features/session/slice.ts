import { createSelector, createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { IError } from '../error/slice';

interface ISessionState {
    initial: boolean;
    loading: boolean;
    session: ISession | null;
    error?: IError;
};

export interface ILoginPayload {
    id: string;
    password: string;
    device: string;
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
    session: null
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
            state.error = undefined;
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
            state.error = undefined;
        },
        logoutSuccess:(state) => {
            state.loading = true;
            state.session = null
            state.error = undefined;
        },
        logoutFailure: (state, { payload }: PayloadAction<IError>) => {
            state.loading = false;
            state.error = payload
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