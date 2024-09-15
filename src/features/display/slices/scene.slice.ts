import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { SceneStoreData } from "../types/scene.types";

export interface SceneState {
    activeSceneId?: string | undefined;
    sceneList: Array<SceneStoreData>;
}

export interface SceneActions {
    setActiveScene: (sceneId: string | undefined) => void;
    addSceneData: (sceneData: SceneStoreData) => void;
    removeScene: (sceneId: string) => void;
    updateSceneData: (sceneData: SceneStoreData) => void;
    moveScene: (sceneId: string, index: number) => void;
    setSceneListData: (sceneData: Array<SceneStoreData>) => void;
}

export type SceneSlice = SceneState & SceneActions;

export const initialSceneSliceState: SceneState = {
    activeSceneId: undefined,
    sceneList: [],
}

export const createSceneSlice: StateCreator<
    BoundStore,
    [],
    [],
    SceneSlice
> = (set) => ({
    ...initialSceneSliceState,
    setActiveScene: (sceneId: string | undefined) => set((state) => ({ 
        activeSceneId: state.sceneList.find(scene => scene.surfaceData.id === sceneId)?.surfaceData.id 
    })),
    addSceneData: (sceneData: SceneStoreData) => set((state) => ({ 
        sceneList: [...state.sceneList.filter(scene => scene.surfaceData.id != sceneData.surfaceData.id), sceneData] 
    })),
    updateSceneData: (sceneData: SceneStoreData) => set((state) => {
        const idx = state.sceneList.findIndex(scene => scene.surfaceData.id === sceneData.surfaceData.id);
        const sceneList = state.sceneList.toSpliced(idx, 1, sceneData);
        return {sceneList: sceneList}
    }),
    removeScene: (sceneId: string) => set((state) => ({ sceneList: state.sceneList.filter(scene => scene.surfaceData.id != sceneId) })),
    setSceneListData: (setSceneList: Array<SceneStoreData>) => set(() => ({sceneList: setSceneList})),
    moveScene: (sceneId: string, index: number) => set((state) => {
        const scene = state.sceneList.find(scene => scene.surfaceData.id === sceneId);
        if (!scene) {
            throw new Error("Cannot find scene");
        }

        const response = state.sceneList.filter(scene => scene.surfaceData.id != sceneId);
        response.splice(index, 0, scene);
        return { sceneList: response };
    }),
});