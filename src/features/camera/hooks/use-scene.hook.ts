import useBoundStore from "../../../hooks/use-bound-store";
import { LayerFileSystemStoreLoaderService } from "../../layer/services/layer-file-system-loader.service";
import { Scene } from "../entities/scene.entity";
import { SceneStoreData, SceneStoreLoader } from "../services/scene/scene-store-loader/scene-store-loader.service";

function parseSceneListData(sceneLoader: SceneStoreLoader, sceneListData: Array<Scene | SceneStoreData>) {
    return sceneListData.map((sceneData: Scene | SceneStoreData)  =>
        sceneData instanceof Scene ? sceneData : sceneLoader.loadScene(sceneData)
    );
}

function parseActiveScene(sceneLoader: SceneStoreLoader, sceneList: Array<Scene>, activeSceneData?: Scene | SceneStoreData) {
    if (!activeSceneData) {
        return activeSceneData;
    }
    
    const activeScene = activeSceneData instanceof Scene ? activeSceneData : sceneLoader.loadScene(activeSceneData);
    const activeSceneId = activeScene.getId();
    return sceneList.some(scene => scene.getId() === activeSceneId) ? activeScene : undefined;
}

export function useScene() {
    const activeSceneData = useBoundStore(state => state.activeScene);
    const sceneListData = useBoundStore(state => state.sceneList);

    const setActiveScene = useBoundStore(state => state.setActiveScene);
    const addScene = useBoundStore(state => state.addScene);
    const removeScene = useBoundStore(state => state.removeScene);
    const setSceneList = useBoundStore(state => state.setSceneList);
    const moveScene = useBoundStore(state => state.moveScene);

    const sceneLoader = new SceneStoreLoader(
        new LayerFileSystemStoreLoaderService()
    );

    const sceneList = parseSceneListData(sceneLoader, sceneListData);
    const activeScene = parseActiveScene(sceneLoader, sceneList, activeSceneData);

    if (activeSceneData && !(activeSceneData instanceof Scene)) {
        setActiveScene(activeScene);
        setSceneList(sceneList);
    }

    return {
        activeScene,
        sceneList,
        setActiveScene,
        addScene,
        removeScene,
        setSceneList,
        moveScene
    }
}