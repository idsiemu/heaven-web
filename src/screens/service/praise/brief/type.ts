export interface IParam {
    role?: number;
    idx?: number;
}

export interface IBrief {
    open: boolean;
    value: string;
    when: Date | null;
    content: string;
}
