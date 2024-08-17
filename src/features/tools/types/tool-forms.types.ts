export type ToolFormComponent = ToolSlider
export enum ToolFormComponents {
    SLIDER = "slider"
}
export type ToolSlider = {
    type: ToolFormComponents.SLIDER,
    name: string,
    handle: string,
    min: number,
    max: number,
    defaultValue: number,
    step?: number
}