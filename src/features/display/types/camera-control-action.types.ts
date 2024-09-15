export interface CameraControlPayload {
    zoom: number
}

export type CameraControlFn = (payload: CameraControlPayload) => void;