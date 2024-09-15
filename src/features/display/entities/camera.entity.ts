import { RefObject } from "react";
import { Dimension, Position } from "../../../types/geometry.types";
import { SingleColorLayer } from "../../layer/entity/layers/single-color-layer.entity";
import { boundBetween } from "../../../utils/math";
import { Scene } from "./scene.entity";
import { fitBoundingBox } from "../utils/camera.utils";

export class Camera {
    private display?: RefObject<HTMLCanvasElement>;
    private scroll?: RefObject<HTMLDivElement>;
    private displayDimensions: Dimension;
    private scenes: Map<string, Scene>;
    private activeSceneId?: string;

    constructor() {
        this.displayDimensions = {width: 0, height: 0};
        this.display = undefined;
        this.scroll = undefined;
        this.activeSceneId = undefined;
        this.scenes = new Map<string, Scene>();
    }

    centerCamera() {
        const scroll = this.scroll?.current;
        const scene = this.getActiveScene();
        
        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.");
        }

        if (!scene) { 
            throw new Error("No scene is active");
        }

        scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth ) / 2;
        scroll.scrollTop = (scroll.scrollHeight - scroll.clientHeight ) / 2;
        scene.setScrollPositionPercentage({x: scroll.scrollLeft, y: scroll.scrollTop});
    }

    getBaseBoardDimensions() {
        const scene = this.getActiveScene();
        if (!scene) {
            throw new Error("No scene is active");
        }
        const surfaceDimensions = scene.getSurface().getDimensions();
        const boardDimensions = fitBoundingBox(surfaceDimensions, this.displayDimensions)
        return boardDimensions;  
    }

    rotateCamera(radians: number): void {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }
        const rotation = scene.getRotation();
        scene.setRotation(rotation + radians);
    }

    getActiveScene() {
        if (this.activeSceneId === undefined) {
            return undefined;
        }

        return this.scenes.get(this.activeSceneId);
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
        const newScrollX = boundBetween(scroll.scrollLeft + xOffset, 0, maxWidthScroll);
        const newScrollY = boundBetween(scroll.scrollTop + yOffset, 0, maxHeightScroll);
        scene.setScrollPositionPercentage({x: newScrollX/maxWidthScroll, y: newScrollY/maxHeightScroll});
        scroll.scrollTop = newScrollY;
        scroll.scrollLeft = newScrollX;
    }

    getScenePosition(displayPos: Position) {
        const scene = this.getActiveScene();
        if (!scene) {
            throw new Error("No scene is active");
        }
        const surfaceDimensions = scene.getSurface().getDimensions();
        const boardDimensions = this.getBaseBoardDimensions();
        const sceneZoom = scene.getZoom();
        const scenePadding = scene.getPaddingDimensions();
        const boardWidth = boardDimensions.width*sceneZoom;
        const boardHeight = boardDimensions.height*sceneZoom;
        const displayPosX = boundBetween(displayPos.x-scenePadding.width, 0, boardWidth);
        const displayPosY = boundBetween(displayPos.y-scenePadding.height, 0, boardHeight);
        const canvasPosX = displayPosX/boardWidth*surfaceDimensions.width;
        const canvasPosY = displayPosY/boardHeight*surfaceDimensions.height;
        return {x: canvasPosX, y: canvasPosY}
    }

    setCameraZoom(zoom: number, displayPos?: Position) {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }

        scene.setZoom(zoom);
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

        const sceneScrollPosition = scene.getScrollPositionPercentage();
        const scenePadding = scene.getPaddingDimensions();
        const sceneZoom = scene.getZoom();

        const boardDimensions = this.getBaseBoardDimensions();
        const zoomedBoardDimension = {width: boardDimensions.width*sceneZoom, height: boardDimensions.height*sceneZoom};

        const scrollWidthPercentage = sceneScrollPosition.x;
        const scrollHeightPercentage = sceneScrollPosition.y;
        const canvasPixelPercentageX = (Number(displayPos?.x) - scenePadding.width) / (zoomedBoardDimension.width);
        const canvasPixelPercentageY = (Number(displayPos?.y) - scenePadding.height) / (zoomedBoardDimension.height);
        const viewportPixelDistanceX = Number(displayPos?.x) - scroll.scrollLeft;
        const viewportPixelDistanceY = Number(displayPos?.y) - scroll.scrollTop;

        const newZoomOffset = sceneZoom + zoomOffset;
        const newZoomedWidth = boardDimensions.width*newZoomOffset;
        const newZoomedHeight = boardDimensions.height*newZoomOffset;

        if (newZoomOffset <= 0) {
            throw new Error("Zoom cannot be below or equal to 0.");
        }

        scene.setZoom(newZoomOffset);
        display.width = newZoomedWidth + 2*scenePadding.width;
        display.height = newZoomedHeight + 2*scenePadding.height;
        display.style.width = `${newZoomedWidth + 2*scenePadding.width}px`;
        display.style.height = `${newZoomedHeight + 2*scenePadding.height}px`;
        this.draw();
        
        if (displayPos) {
            scroll.scrollLeft = scenePadding.width + canvasPixelPercentageX*boardDimensions.width*sceneZoom - viewportPixelDistanceX;
            scroll.scrollTop =  scenePadding.height + canvasPixelPercentageY*boardDimensions.height*sceneZoom - viewportPixelDistanceY;
        }
        else {
            scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth) * scrollWidthPercentage;
            scroll.scrollTop = (scroll.scrollHeight - scroll.clientHeight) * scrollHeightPercentage;
        }

        const maxWidthScroll = scroll.scrollWidth - scroll.clientWidth;
        const maxHeightScroll = scroll.scrollHeight - scroll.clientHeight;
        scene.setScrollPositionPercentage({x: scroll.scrollLeft/maxWidthScroll, y: scroll.scrollTop/maxHeightScroll});
    }

    getZoom() {
        const scene = this.getActiveScene();
        if (!scene) { 
            throw new Error("No scene is active");
        }
        return scene.getZoom();
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

        const maxWidthScroll = scroll.scrollWidth - scroll.clientWidth;
        const maxHeightScroll = scroll.scrollHeight - scroll.clientHeight;
        const scrollPos = scene.getScrollPositionPercentage();
        scroll.scrollLeft = scrollPos.x*maxWidthScroll;
        scroll.scrollTop = scrollPos.y*maxHeightScroll;
    }

    rescaleCamera() {
        const scene = this.getActiveScene();
        if (!scene || !this.activeSceneId) { 
            throw new Error("No scene is active");
        }
        if (!this.display?.current) {
            throw new Error("Canvas element is invalid or undefined.")
        }

        const display = this.display.current;
        const dimensions = this.getBaseBoardDimensions();
        const sceneZoom = scene.getZoom();
        const newPadding = {
            width: this.displayDimensions.width * 0.66, 
            height: this.displayDimensions.height * 0.66
        }

        scene.setPaddingDimensions(newPadding);
        display.width = dimensions.width*sceneZoom + 2*newPadding.width;
        display.height = dimensions.height*sceneZoom  + 2*newPadding.height;
        display.style.width = `${display.width}px`;
        display.style.height = `${display.height}px`;
    }


    addScene(scene: Scene) {
        this.scenes.set(scene.getId(), scene);
    }

    removeScene(scene: Scene) {
        this.scenes.delete(scene.getId());
    }

    getSceneList() {
        return Array.from(this.scenes.values()).map(scene => scene);
    }

    setScene(scene?: Scene) {
        const display = this.display?.current;
        const scroll = this.scroll?.current;
        if (scene && !this.scenes.has(scene.getId())) {
            console.error(`
                Invalid canvas. 
                Tried to set canvas '${scene.getId()}' but it doesn't exist. 
                Setting active canvas to undefined.
            `);
            this.setScene(undefined);
            return;
        }

        if (!scroll) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!display) {
            throw new Error("Canvas scroll element is invalid or undefined.")
        }

        if (!scene) {
            this.activeSceneId = undefined;
            return;
        }   


        this.activeSceneId = scene?.getId();
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
        if (!currentScene) {
            throw new Error("Cannot update state. No scene is active.");
        }
        const maxWidthScroll = scroll.scrollWidth - scroll.clientWidth;
        const maxHeightScroll = scroll.scrollHeight - scroll.clientHeight;
        currentScene.setScrollPositionPercentage({
            x: scroll.scrollLeft/maxWidthScroll, 
            y: scroll.scrollTop/maxHeightScroll
        });
        console.log(
            `Recording scroll position for '${currentScene.getSurface().getName()}'. ` + 
            `Recorded: ${JSON.stringify(currentScene.getScrollPositionPercentage())}.`
        );
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
        this.displayDimensions = {
            width: displayRef.current.scrollWidth, 
            height: displayRef.current.scrollHeight,
        }
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

        const boardDimensions = this.getBaseBoardDimensions();
        const sceneZoom = scene.getZoom();
        const scenePadding = scene.getPaddingDimensions();
        const boardWidth =  boardDimensions.width*sceneZoom;
        const boardHeight = boardDimensions.height*sceneZoom;
        const displayPaddingWidth = scenePadding.width;
        const displayPaddingHeight = scenePadding.height;

        // draw background
        ctx.fillStyle = "#363737";
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        const time = Date.now();

        // draw layers
        const layers = scene.getSurface().getLayers();
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
        console.log(`zoom: ${scene.getZoom()}`);
        console.log(`Paint Duration: ${duration}`);
    }
}