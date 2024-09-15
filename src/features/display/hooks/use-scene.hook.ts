import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useInjection } from "../../../components/provider/inversify-container/inversify-container-provider.component";
import useBoundStore from "../../../hooks/use-bound-store";
import { Scene } from "../entities/scene.entity";
import { SceneStoreLoaderService } from "../services/scene/scene-store-loader/scene-store-loader.service";

export function useScene() {
    const [sceneState, setSceneState] = useState<{scene: Scene | undefined}>({scene: undefined});
    const [sceneListState, setSceneListState] = useState<Array<Scene>>([]);
    const activeSceneId = useBoundStore(state => state.activeSceneId);
    const sceneListData = useBoundStore(state => state.sceneList);

    const setActiveScene = useBoundStore(state => state.setActiveScene);
    const addSceneData = useBoundStore(state => state.addSceneData);
    const removeSceneData = useBoundStore(state => state.removeScene);
    const setSceneListData = useBoundStore(state => state.setSceneListData);
    const updateSceneData = useBoundStore(state => state.updateSceneData);
    const moveSceneData = useBoundStore(state => state.moveScene);
    const sceneLoader = useInjection(SceneStoreLoaderService);

    const addScene = (scene: Scene) => addSceneData(sceneLoader.convertSceneToJson(scene));
    const updateScene = (scene: Scene) => updateSceneData(sceneLoader.convertSceneToJson(scene));
    
    const setSceneStateDebounce = useDebouncedCallback((scene) => {
        updateScene(scene);
        setSceneState({scene});
    }, 0);
    
    useEffect(() => {
        const sceneList = sceneListData.map(sceneData => sceneLoader.loadScene(sceneData));
        setSceneListState(sceneList);

        const activeScene = sceneList.find(scene => activeSceneId  === scene.getId());
        if (activeScene?.getId() != sceneState.scene?.getId()) {
            setSceneState({scene: activeScene});
            activeScene?.setOnChange((scene: Scene) => setSceneStateDebounce(scene));
        }

    }, [sceneListData, activeSceneId]);

    //console.log('activeScene: ' + JSON.stringify(sceneState.scene));
    return {
        activeScene: sceneState.scene,
        sceneList: sceneListState,
        setActiveScene: setActiveScene,
        updateScene: updateScene,
        addScene: addScene,
        removeScene: removeSceneData,
        setSceneList: setSceneListData,
        moveScene: moveSceneData
    }
}