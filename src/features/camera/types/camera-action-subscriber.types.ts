import { Camera } from "../entities/camera.entity";

export enum CameraActions {
    ON_CLICK = "onClick",
    ON_MOUSE_DOWN= "onMouseDown",
    ON_MOUSE_UP = "onMouseUp",
    ON_MOUSE_MOVE = "onMouseMove",
    ON_MOUSE_EXIT = "onMouseLeave",
    ON_MOUSE_ENTER = "onMouseEnter",
    ON_SCROLL = "onScroll",
}

export interface CameraActionPayload {
    event: MouseEvent,
    camera: Camera,
    cursorRef?: React.RefObject<HTMLCanvasElement>
}

export type CameraActionFn = (payload: CameraActionPayload) => void;
