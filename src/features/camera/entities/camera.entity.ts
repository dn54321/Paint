import { RefObject } from "react";
import { Dimension, Position } from "../../../types/geometry.types";
import { Canvas } from "../../canvas/entities/canvas.entity";
import { SingleColorLayer } from "../../layer/entity/layers/single-color-layer.entity";
import { boundBetween } from "../../../utils/math";

export interface Scene {
    canvas: Canvas;
    zoom: number;
    rotation: number;
    scrollPositions: Position;
    paddingX: number;
    paddingY: number;
    baseWidth: number;
    baseHeight: number;
}

export class Camera {
    private display?: RefObject<HTMLCanvasElement>;
    private scroll?: RefObject<HTMLDivElement>;
    private initialDisplayWidth: number;
    private initialDisplayHeight: number;
    private scenes: Map<string, Scene>;
    private activeCanvasId?: string;

    constructor() {
        this.initialDisplayWidth = 0;
        this.initialDisplayHeight = 0;
        this.display = undefined;
        this.scroll = undefined;
        this.activeCanvasId = undefined;
        this.scenes = new Map<string, Scene>();
    }

    centerCamera() {
        const scroll = this.scroll?.current;
        const scene = this.getActiveScene();
        
        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!scene) { 
            throw new Error("No scene is active");
        }

        scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth ) / 2;
        scroll.scrollTop = (scroll.scrollHeight - scroll.clientHeight ) / 2;
        scene.scrollPositions = {x: scroll.scrollLeft, y: scroll.scrollTop};
    }

    rotateCamera(radians: number): void {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }
        scene.rotation += radians;
    }

    getActiveScene() {
        if (this.activeCanvasId === undefined) {
            return undefined;
        }

        return this.scenes.get(this.activeCanvasId);
    }

    moveCamera(yOffset: number, xOffset: number): void {
        const scroll = this.scroll?.current;
        const scene = this.getActiveScene();
        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!scene) { 
            throw new Error("No scene is active");
        }

        const maxWidthScroll = scroll.scrollWidth - scroll.clientWidth;
        const maxHeightScroll = scroll.scrollHeight - scroll.clientHeight;
        const newScrollX = boundBetween(scene.scrollPositions.x + xOffset, 0, maxWidthScroll);
        const newScrollY = boundBetween(scene.scrollPositions.y + yOffset, 0, maxHeightScroll);
        scene.scrollPositions = {x: newScrollX, y: newScrollY};
        scroll.scrollTop = newScrollY;
        scroll.scrollLeft = newScrollX;

    }

    getCanvasPosition(displayPos: Position) {
        const scene = this.getActiveScene();
        if (!scene) {
            throw new Error("No scene is active");
        }
        const canvasDimensions = scene.canvas.getDimensions();
        const boardWidth = scene.baseWidth*scene.zoom;
        const boardHeight = scene.baseHeight*scene.zoom;
        const displayPosX = boundBetween(displayPos.x-scene.paddingX, 0, boardWidth);
        const displayPosY = boundBetween(displayPos.x-scene.paddingX, 0, boardHeight);
        const canvasPosX = displayPosX/boardWidth*canvasDimensions.width;
        const canvasPosY = displayPosY/boardHeight*canvasDimensions.height;
        return {x: canvasPosX, y: canvasPosY}
    }

    setCameraZoom(zoom: number, displayPos?: Position) {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }

        scene.zoom = zoom;
        this.zoomCamera(0, displayPos);
    }

    getDisplayRef() {
        return this.display;
    }

    getScrollRef() {
        return this.scroll;
    }

    zoomCamera(zoomOffset: number, displayPos?: Position): void {
        const scroll = this.scroll?.current;
        const display = this.display?.current;
        const scene = this.getActiveScene();
        
        if (!scene) { 
            throw new Error("No scene is active");
        }

        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!display) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        const scrollWidthPercentage = scene.scrollPositions.x/((scroll.scrollWidth - scroll.clientWidth) || 1);
        const scrollHeightPercentage = scene.scrollPositions.y/((scroll.scrollHeight - scroll.clientHeight) || 1);
        const canvasPixelPercentageX = (Number(displayPos?.x) - scene.paddingX) / (scene.baseWidth * scene.zoom);
        const canvasPixelPercentageY = (Number(displayPos?.y) - scene.paddingY) / (scene.baseHeight * scene.zoom);
        const viewportPixelDistanceX = Number(displayPos?.x) - scroll.scrollLeft;
        const viewportPixelDistanceY = Number(displayPos?.y) - scroll.scrollTop;

        const displayPaddingX = scene.paddingX;
        const displayPaddingY = scene.paddingY;

        const newZoomOffset = scene.zoom + zoomOffset;
        const newZoomedWidth = scene.baseWidth*newZoomOffset;
        const newZoomedHeight = scene.baseHeight*newZoomOffset;

        if (newZoomOffset <= 0) {
            throw new Error("Zoom cannot be below or equal to 0.");
        }

        scene.zoom = newZoomOffset;
        display.width = newZoomedWidth + 2*displayPaddingX;
        display.height = newZoomedHeight + 2*displayPaddingY;
        display.style.width = `${newZoomedWidth + 2*displayPaddingX}px`;
        display.style.height = `${newZoomedHeight + 2*displayPaddingY}px`;
        this.draw();
        
        if (displayPos) {
            scroll.scrollLeft = displayPaddingX + canvasPixelPercentageX*scene.baseWidth*scene.zoom - viewportPixelDistanceX;
            scroll.scrollTop =  displayPaddingY + canvasPixelPercentageY*scene.baseHeight*scene.zoom - viewportPixelDistanceY;
        }
        else {
            scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth) * scrollWidthPercentage;
            scroll.scrollTop = (scroll.scrollHeight - scroll.clientHeight) * scrollHeightPercentage;
        }

        scene.scrollPositions = {x: scroll.scrollLeft, y: scroll.scrollTop};
    }

    getZoom() {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }
        return scene.zoom;
    }

    isReady() {
        return Boolean(this.getActiveScene());
    }

    adjustCameraScroll() {
        const scroll = this.scroll?.current;
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }

        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (scene.scrollPositions.x === -1 && scene.scrollPositions.y === -1) {
            scene.scrollPositions = {
                x: (scroll.scrollWidth - scroll.clientWidth)/2, 
                y: (scroll.scrollHeight - scroll.clientHeight)/2
            };
        }

        scroll.scrollLeft = scene.scrollPositions.x;
        scroll.scrollTop = scene.scrollPositions.y;
    }

    rescaleCamera() {
        const scene = this.getActiveScene();
        if (!scene || !this.activeCanvasId) { 
            throw new Error("No scene is active");
        }
        if (!this.display?.current) {
            throw new Error("Canvas element is invalid or undefined.")
        }

        const display = this.display.current;
        const baseDimensions = this.convertCanvasToScene(scene.canvas);
        const newScene = {
            ...scene,
            paddingX: baseDimensions.paddingX,
            paddingY: baseDimensions.paddingY,
            baseWidth: baseDimensions.baseWidth,
            baseHeight: baseDimensions.baseHeight,
        }

        this.scenes.set(this.activeCanvasId, newScene);
        display.width = newScene.baseWidth*newScene.zoom + 2*newScene.paddingX;
        display.height = newScene.baseHeight*newScene.zoom  + 2*newScene.paddingY;
        display.style.width = `${display.width}px`;
        display.style.height = `${display.height}px`;
    }

    convertCanvasToScene(canvas: Canvas) {
        const displayWidth = this.initialDisplayWidth;
        const displayHeight = this.initialDisplayHeight;
        const canvasDims = canvas.getDimensions();
        const horizontalScale = canvasDims.width/displayWidth;
        const verticalScale = canvasDims.height/displayHeight;
        let dimensions: Dimension;

        if (horizontalScale > verticalScale) {
            const width = displayWidth;
            const height = displayWidth * canvasDims.height/canvasDims.width;
            dimensions = {width: width, height: height};
        }
        else {
            const height = displayHeight;
            const width =  displayHeight * canvasDims.width/canvasDims.height;
            dimensions = {width: width, height: height};
        }

        return {
            canvas,
            zoom: 0.95,
            rotation: 0,
            scrollPositions: {x: -1, y: -1},
            paddingX: displayWidth * 0.66,
            paddingY: displayHeight * 0.66,
            baseWidth: dimensions.width,
            baseHeight: dimensions.height,
            scenes: []
        }
    }

    addCanvas(canvas: Canvas) {
        const scene = this.convertCanvasToScene(canvas);
        this.scenes.set(canvas.getId(), scene);
    }

    getActiveCanvas() {
        return this.getActiveScene()?.canvas;
    }

    removeCanvas(canvas: Canvas) {
        this.scenes.delete(canvas.getId());
    }

    getCanvasList() {
        return Array.from(this.scenes.values()).map(scene => scene.canvas);
    }

    setCanvas(canvas?: Canvas) {
        const display = this.display?.current;
        const scroll = this.scroll?.current;
        if (canvas && !this.scenes.has(canvas.getId())) {
            console.error(`
                Invalid canvas. 
                Tried to set canvas '${canvas.getId()}' but it doesn't exist. 
                Setting active canvas to undefined.
            `);
            this.setCanvas(undefined);
            return;
        }

        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!display) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!canvas) {
            this.activeCanvasId = undefined;
            return;
        }   


        this.activeCanvasId = canvas?.getId();
        this.rescaleCamera();
        this.adjustCameraScroll();
        this.draw();  
    }

    updateState() {
        const scroll = this.scroll?.current;

        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.");
        }

        const currentScene = this.getActiveScene();   
        if (currentScene) {
            currentScene.scrollPositions = {x: scroll.scrollLeft, y: scroll.scrollTop};
            console.log(
                `Recording scroll position for '${currentScene.canvas.getName()}'. ` + 
                `Recorded: ${JSON.stringify(currentScene.scrollPositions)}.`
            );
            console.log();
        }  
        
    }

    setDisplayRef(displayRef: RefObject<HTMLCanvasElement>) {
        if (!displayRef.current) {
            throw new Error("Canvas element is invalid or undefined.")
        }

        this.display = displayRef;
        displayRef.current.removeAttribute('width');
        displayRef.current.removeAttribute('height');
        displayRef.current.style.width = "100%";
        displayRef.current.style.height = "100%";
        this.initialDisplayWidth = displayRef.current.scrollWidth;
        this.initialDisplayHeight = displayRef.current.scrollHeight;
    }

    setScrollRef(scrollRef: RefObject<HTMLDivElement>) {
        if (!scrollRef.current) {
            throw new Error("Canvas element is invalid or undefined.")
        }

        this.scroll = scrollRef;
    }

    draw() {
        const scene = this.getActiveScene();

        
        if (!this.display?.current) {
            throw new Error("Canvas element is invalid or undefined.")
        }

        const ctx = this.display.current.getContext("2d");
        const displayWidth = this.display.current.scrollWidth;
        const displayHeight = this.display.current.scrollHeight;

        if (ctx === undefined || ctx === null) { 
            throw new Error("Could not get board context");
        }

        if (!scene) { 
            console.log("No scene is active");
            ctx.fillStyle = "white";
            ctx?.fillRect(0 , 0, displayWidth, displayHeight);
            return;
        }

        const boardWidth =  scene.baseWidth*scene.zoom;
        const boardHeight = scene.baseHeight*scene.zoom;
        const displayPaddingWidth = scene.paddingX;
        const displayPaddingHeight = scene.paddingY;

        // draw background
        ctx.fillStyle = "#363737";
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        const time = Date.now();

        // draw layers
        const layers = scene.canvas.getLayers();
        for (const layer of layers) {
            if (layer instanceof SingleColorLayer) {
                ctx.fillStyle = "white";
                ctx.fillRect(displayPaddingWidth, displayPaddingHeight, boardWidth, boardHeight);
            }

            // for (let i = 0; i < boardHeight; ++i) {
            //     for (let j = 0; j < boardWidth; ++j) {
            //         const canvasLocation = {
            //             y: i/boardHeight*canvasHeight,
            //             x: j/boardWidth*canvasWidth, 
            //         }

            //         if (
            //             canvasLocation.y < canvasHeight && canvasLocation.y >= 0 && 
            //             canvasLocation.x < canvasWidth && canvasLocation.x >= 0
            //         ) {
            //             ctx.fillStyle = "white";
            //             ctx.fillRect(displayPaddingWidth + j, displayPaddingHeight + i, 1, 1);
            //         }
            //     }
            // }
        }
        const duration = Date.now() - time;
        console.log(`zoom: ${scene.zoom}`);
        console.log(`Paint Duration: ${duration}`);
    }
}