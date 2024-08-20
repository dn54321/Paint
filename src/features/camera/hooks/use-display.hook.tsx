import { useEffect, useState } from "react";
import { Display } from "../components/drawable-display/display";
import { Camera } from "../entities/camera.entity";
import { CameraActionSubscriber } from "../services/camera/camera-action-subscriber.service";
import { CameraControlSubscriber } from "../services/camera/camera-control-subscriber.service";
import { useScene } from "./use-scene.hook";


export function useDisplay() {
    const {sceneList, activeScene} = useScene()
    const [camera] = useState(new Camera());
    const [cameraActions] = useState(new CameraActionSubscriber());
    const [cameraControls] = useState(new CameraControlSubscriber());
    const displayComponent = () => (
        <Display 
            camera={camera} 
            actionSubscriber={cameraActions}
            controlSubscriber={cameraControls}
        />
    );

    useEffect(() => {
        console.log("Detected scene list change.");
        const cameraScene = camera.getSceneList();
        const cameraSceneIdSet = new Set(cameraScene.map(scene => scene.getId()));
        const sceneIdsSet = new Set(sceneList.map(scene => scene.getId()))
        const missingCameraScene = sceneList.filter(scene => !cameraSceneIdSet.has(scene.getId()));
        const missingScene = cameraScene.filter(scene => !sceneIdsSet.has(scene.getId()));
        
        for (const scene of missingCameraScene) {
            camera.addScene(scene);
        }

        for (const scene of missingScene) {
            camera.removeScene(scene);
        }
    }, [sceneList]);

    useEffect(() => {
        console.log("Detected active scene change.");
        if (camera.getActiveScene()?.getId() != activeScene?.getId()) {
            camera.setScene(activeScene);
        }
    }, [activeScene]);

    useEffect(() => {})




    return {
        Display: displayComponent, 
        cameraActions: cameraActions,
        cameraControls: cameraControls,
        camera: camera,
        zoom: Number,
    }
}   