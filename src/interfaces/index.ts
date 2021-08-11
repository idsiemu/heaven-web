export interface IParam {
    idx: number;
}

export interface IProps {
    query: IParam;
    params: object;
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