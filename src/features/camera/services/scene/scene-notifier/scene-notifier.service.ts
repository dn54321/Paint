import { SceneAction } from "../../types/scene-action.types";

export class SceneNotifier {
    private static instance: SceneNotifier;
    private listeners: Map<string, Record<string, (sceneAction: SceneAction) => void>>;

    constructor() {
        this.listeners = new Map();
    }

    notify(sceneId: string, sceneAction: SceneAction) {
        const records = this.listeners.get(sceneId);
        if (records) {
            Object.values(records).forEach(action => action(sceneAction));
        }
    }

    subscribe(key: string, sceneId: string, action: (sceneAction: SceneAction) => void) {
        if (!this.listeners.has(sceneId)) {
            this.listeners.set(sceneId, {});
        }

        const records = this.listeners.get(sceneId)!;
        records[key] = action;
    }
}