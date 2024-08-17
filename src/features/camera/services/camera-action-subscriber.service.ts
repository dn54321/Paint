import { CameraActionFn, CameraActionPayload, CameraActions } from "../types/camera-action-subscriber.types";

type EventName = string;
type SubscriberName = string;

export class CameraActionSubscriber {
    private actions: Record<EventName, Record<SubscriberName, CameraActionFn>>;
    constructor() {
        this.actions = {}
    }

    subscribe(eventName: CameraActions, actionName: string, action: (payload: CameraActionPayload) => void) {
        if (!(eventName in this.actions)) {
            this.actions[eventName] = {};
        }

        this.actions[eventName][actionName] = action;
    }

    play(eventName: CameraActions, payload: CameraActionPayload) {
        if (eventName in this.actions) {
            for (const action of Object.values(this.actions[eventName])) {
                action(payload);
            }
        }
    }
}