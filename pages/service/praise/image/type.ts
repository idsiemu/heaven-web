import { IResponse } from "@interfaces";

export interface IObjectCover {
    getImages : IImagesResponse
}

export interface IImagesResponse extends IResponse {
    data : IImages[]
    location? : string
}

export interface IImages {
    idx : number
    domain: string
    origin: string
    m_size? : string
    order_by : number
}

export interface IDelParam {
    image_idx : number
    index : number
}