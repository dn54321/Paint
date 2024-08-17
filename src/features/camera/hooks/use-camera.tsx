import { useEffect, useState } from "react";
import useBoundStore from "../../../hooks/use-bound-store";
import { Display } from "../components/display/display";
import { Camera } from "../entities/camera.entity";
import { CameraActionSubscriber } from "../services/camera-action-subscriber.service";
import { CameraControlSubscriber } from "../services/camera-control-subscriber.service";


export function useCamera() {
    const canvasList = useBoundStore(state => state.canvasList);
    const activeCanvas = useBoundStore(state => state.activeCanvas);
    const [camera] = useState(new Camera());
    const [cameraActions] = useState(new CameraActionSubscriber());
    const [cameraControls] = useState(new CameraControlSubscriber());
    const displayComponent = () => (
        <Display camera={camera} actionSubscriber={cameraActions} controlSubscriber={cameraControls}/>
    );

    useEffect(() => {
        console.log("Detected canvas list change.");
        const cameraCanvas = camera.getCanvasList();
        const cameraCanvasIdSet = new Set(cameraCanvas.map(canvas => canvas.getId()));
        const canvasIdsSet = new Set(canvasList.map(canvas => canvas.getId()))

        const missingCameraCanvas = canvasList.filter(canvas => !cameraCanvasIdSet.has(canvas.getId()));
        const missingCanvas = cameraCanvas.filter(canvas => !canvasIdsSet.has(canvas.getId()));
        
        for (const canvas of missingCameraCanvas) {
            camera.addCanvas(canvas);
        }

        for (const canvas of missingCanvas) {
            camera.removeCanvas(canvas);
        }
    }, [canvasList]);

    useEffect(() => {
        console.log("Detected active canvas change.");
        if (camera.getActiveCanvas()?.getId() != activeCanvas?.getId()) {
            camera.setCanvas(activeCanvas);
        }
    }, [activeCanvas]);

    useEffect(() => {})




    return {
        Display: displayComponent, 
        cameraActions: cameraActions,
        cameraControls: cameraControls,
        camera: camera,
        zoom: Number,
    }
}   