import { DisplayActionEventMap, DisplayActions, DisplayEventActionFn, DisplayEvents } from "../../types/camera-action.types";

type EventName = string;
type SubscriberName = string;

export class CameraActionSubscriber {
    private actions: Record<EventName, Record<SubscriberName, DisplayEventActionFn>>;
    constructor() {
        this.actions = {}
    }

    subscribe<T extends DisplayActions>(eventName: T, actionName: string, action: DisplayEventActionFn<DisplayActionEventMap[T]>) {
        if (!(eventName in this.actions)) {
            this.actions[eventName] = {};
        }

        this.actions[eventName][actionName] = action as DisplayEventActionFn<DisplayEvents>;
    }

    play<T extends DisplayActions>(eventName: T, payload: DisplayActionEventMap[T]) {
        if (eventName in this.actions) {
            for (const action of Object.values(this.actions[eventName])) {
                action(payload);
            }
        }
    }
}