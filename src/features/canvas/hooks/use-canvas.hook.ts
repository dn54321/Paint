import useBoundStore from "../../../hooks/use-bound-store";
import { LayerFileSystemStoreLoaderService } from "../../layer/services/layer-file-system-loader.service";
import { Canvas } from "../entities/canvas.entity";
import { CanvasStoreData, CanvasStoreLoader } from "../services/canvas-store-loader/canvas-store-loader.service";

function parseCanvasListData(canvasLoader: CanvasStoreLoader, canvasListData: Array<CanvasStoreData | Canvas>) {
    return canvasListData.map((canvasData: Canvas | CanvasStoreData)  =>
        canvasData instanceof Canvas ? canvasData : canvasLoader.load(canvasData)
    );
}

function parseActiveCanvas(canvasLoader: CanvasStoreLoader, canvasList: Array<Canvas>, activeCanvasData?: CanvasStoreData | Canvas) {
    if (!activeCanvasData) {
        return activeCanvasData;
    }
    
    const activeCanvas =  activeCanvasData instanceof Canvas ? activeCanvasData : canvasLoader.load(activeCanvasData);
    return canvasList.some(canvas => canvas.getId() === activeCanvas.getId()) ? activeCanvas : undefined;
}

export function useCanvas() {
    const activeCanvasData = useBoundStore(state => state.activeCanvas);
    const canvasListData = useBoundStore(state => state.canvasList);

    const setActiveCanvas = useBoundStore(state => state.setActiveCanvas);
    const addCanvas = useBoundStore(state => state.addCanvas);
    const removeCanvas = useBoundStore(state => state.removeCanvas);
    const setCanvasList = useBoundStore(state => state.setCanvasList);
    const moveCanvas = useBoundStore(state => state.moveCanvas);

    const canvasLoader = new CanvasStoreLoader(
        new LayerFileSystemStoreLoaderService()
    );

    const canvasList = parseCanvasListData(canvasLoader, canvasListData);
    const activeCanvas = parseActiveCanvas(canvasLoader, canvasList, activeCanvasData);

    if (activeCanvasData && !(activeCanvasData instanceof Canvas)) {
        setActiveCanvas(activeCanvas);
        setCanvasList(canvasList);
    }

    return {
        activeCanvas: activeCanvas,
        canvasList: canvasList,
        setActiveCanvas,
        addCanvas,
        removeCanvas,
        setCanvasList,
        moveCanvas
    }
}