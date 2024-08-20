import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { Scene } from "../entities/scene.entity";

export interface SceneState {
    activeScene?: Scene;
    sceneList: Array<Scene>;
}

export interface SceneActions {
    setActiveScene: (canvas: Scene | undefined) => void;
    addScene: (canvas: Scene) => void;
    removeScene: (canvas: Scene) => void;
    moveScene: (canvas: Scene, index: number) => void;
    setSceneList: (canvas: Array<Scene>) => void;
}

export type SceneSlice = SceneState & SceneActions;

export const initialSceneSliceState: SceneState = {
    activeScene: undefined,
    sceneList: [],
}

export const createSceneSlice: StateCreator<
    BoundStore,
    [],
    [],
    SceneSlice
> = (set) => ({
    ...initialSceneSliceState,
    setActiveScene: (scene: Scene | undefined) => set(() => ({ activeScene: scene })),
    addScene: (scene: Scene) => set((state) => ({ sceneList: [...state.sceneList, scene] })),
    removeScene: (scene: Scene) => set((state) => ({ sceneList: state.sceneList.filter(item => scene != item) })),
    setSceneList: (setSceneList: Array<Scene>) => set(() => ({sceneList: setSceneList})),
    moveScene: (scene: Scene, index: number) => set((state) => {
        const response = state.sceneList.filter(item => item != scene);
        response.splice(index,0,scene);
        return { sceneList: response };
    }),
});