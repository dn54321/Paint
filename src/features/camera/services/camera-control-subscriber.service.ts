import { CameraControlFn, CameraControlPayload } from "../types/camera-control-subscriber.types";

export class CameraControlSubscriber {
    private subscribers: Record<string, CameraControlFn>;
    constructor() {
        this.subscribers = {}
    }

    subscribe(actionName: string, action: (payload: CameraControlPayload) => void) {
        this.subscribers[actionName] = action;
    }

    play(payload: CameraControlPayload) {
        for (const action of Object.values(this.subscribers)) {
            action(payload);
        }
    }
}