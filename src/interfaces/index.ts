import { ReactNode } from "react";

export interface IParam {
    idx: number;
}

export interface IHistory {
    history: Array<string>;
}
export interface IProps {
    history: Array<string>;
    query: IParam;
    params: object;
    children?: ReactNode;
}

export interface IResponse {
    status : number,
    token? : string,
    errors? : IError[]
}

export interface IError {
    code: string
    var?: string
    text?: string
};