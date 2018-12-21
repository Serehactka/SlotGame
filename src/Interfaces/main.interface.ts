export interface IReelProperties {
    x: number,
    height: number,
    reelStep: number
}

export interface IDimensionProperties {
    x?: number,
    y?: number,
    width: number,
    height: number,
    stepIndex: number
}

export interface IEvent {
    type: string,
    data: any
}