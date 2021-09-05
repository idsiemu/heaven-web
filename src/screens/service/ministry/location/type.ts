export interface ILocation {
    idx : number
    location: string
    details : Array<IDetail>
}

interface IDetail {
    idx: number
    location : string
    state: boolean
}