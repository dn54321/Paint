import React, { createRef, useEffect, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { boundBetween, isDimensionEqual } from "../../../../utils/math";
import { BrushCursor } from "../../../tools/components/ui/brush-cursor/brush-cursor.component";
import { useTool } from "../../../tools/hooks/use-tool.hook";
import { Scene } from "../../entities/scene.entity";
import { CameraActionSubscriber } from "../../services/camera/camera-action-subscriber.service";
import { DisplayActions, MouseDisplayActionPayload, ScrollDisplayActionPayload } from "../../types/camera-action.types";
export interface DrawableDisplayProps {
  scene?: Scene
  displayRef?:  React.RefObject<HTMLCanvasElement>,
  viewportRef?: React.RefObject<HTMLDivElement>,
  cursorRef?: React.RefObject<HTMLCanvasElement>,
  backgroundRef?: React.RefObject<HTMLCanvasElement>,
}


export const DrawableDisplay = function (props: DrawableDisplayProps) {
  const scene = props.scene;
  const boardRef = props.displayRef ?? createRef<HTMLCanvasElement>();
  const viewportRef = props.viewportRef ?? createRef<HTMLDivElement>();
  const cursorRef = props.cursorRef ?? createRef<HTMLCanvasElement>();
  const backgroundRef = props.backgroundRef ?? createRef<HTMLCanvasElement>();

  const scenePadding = scene?.getPaddingDimensions();
  const [actionSubscriber] = useState(new CameraActionSubscriber());
  const { activeTool, withToolActions, toolSettings } = useTool();

  withToolActions(actionSubscriber); 

  const getScrollPayload: (e: React.UIEvent<HTMLDivElement, UIEvent>, scene: Scene) => ScrollDisplayActionPayload 
  = (e: React.UIEvent<HTMLDivElement, UIEvent>, scene: Scene) => ({
    event: e, 
    scene, 
    cursorRef, 
    viewportRef, 
    boardRef
  });

  const getMousePayload: (e: MouseEvent, scene: Scene) => MouseDisplayActionPayload 
  = (e: MouseEvent, scene: Scene) => {
    const surfaceDimensions = scene.getSurface().getDimensions();
    const padding = scene.getPaddingDimensions();
    const zoom = scene.getZoom();
    const displayMousePos = {x: e.offsetX, y: e.offsetY};
    const boardMousePos = {
      x: boundBetween(e.offsetX-padding.width, 0, surfaceDimensions.width), 
      y: boundBetween(e.offsetY-padding.height, 0, surfaceDimensions.height)
    };
    const surfaceMousePos = {
      x: boardMousePos.x/zoom,
      y: boardMousePos.y/zoom,
    }
    
    return {
      displayMousePos: displayMousePos,
      surfaceMousePos: surfaceMousePos,
      boardMousePos: boardMousePos,
      event: e,
      scene, 
      cursorRef, 
      viewportRef, 
      boardRef
    }
  };

  const recordScrollDebounce = useDebouncedCallback(() => {
    if (!viewportRef.current) {
      return;
    }

    if (!scene) {
      return;
    }

    const scrollX = viewportRef.current.scrollLeft;
    const scrollY = viewportRef.current.scrollTop;
    const maxScrollX = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
    const maxScrollY = viewportRef.current.scrollHeight - viewportRef.current.clientHeight;
    const sceneScroll = {x: scrollX/maxScrollX, y: scrollY/maxScrollY};
    console.log("scroll Debounce: " + JSON.stringify(sceneScroll));
    scene.setScrollPositionPercentage(sceneScroll);
  }, 250);

  const setScrollByScene = () => {
    if (!viewportRef.current) {
      return;
    }

    const sceneScrollPercentage = scene?.getScrollPositionPercentage() ?? {x:0, y:0};
    const maxScrollWidth = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
    const maxScrollHeight = viewportRef.current.scrollHeight - viewportRef.current.clientHeight;
    viewportRef.current.scrollLeft = maxScrollWidth * sceneScrollPercentage?.x;
    viewportRef.current.scrollTop = maxScrollHeight * sceneScrollPercentage?.y;
  }

  function setScenePadding() {
    if (!viewportRef.current || !boardRef.current) {
      return;
    }

    if (!scene) {
      return;
    }

    const scrollClientWidth = viewportRef.current.clientWidth;
    const scrollClientHeight = viewportRef.current.clientHeight;
    const paddingX = Math.floor(scrollClientWidth*0.66);
    const paddingY = Math.floor(scrollClientHeight*0.66);
    const scenePadding = {width: paddingX, height: paddingY};

    if (!isDimensionEqual(displayPadding, scenePadding)) {
      scene.setPaddingDimensions(scenePadding);
    }

    setScrollByScene();
  }

  function getZoomedBoardDimension() {
    if (!viewportRef.current || !scene) {
      return {width: 0, height: 0};
    }
    
    const zoom = scene.getZoom();
    const surfaceDimensions = scene.getSurface().getDimensions();
    // const viewportDimensions = {width: scrollRef.current.clientWidth, height: scrollRef.current.clientHeight};
    // const boardDimensions = fitBoundingBox(surfaceDimensions, viewportDimensions);
    // const zoomedBoardDimension = {
    //   width: Math.round(boardDimensions.width*zoom), 
    //   height: Math.round(boardDimensions.height*zoom)
    // };

    const zoomedBoardDimension = {
        width: Math.round(surfaceDimensions.width*zoom), 
        height: Math.round(surfaceDimensions.height*zoom)
      };

    return zoomedBoardDimension;
  }

  function adjustDisplayResolution() {
    if (!viewportRef.current || !boardRef.current || !scene || !backgroundRef.current) {
      return;
    }
    
    const padding = scene.getPaddingDimensions();
    const boardDimensions = getZoomedBoardDimension();
    const surfaceDimensions = scene.getSurface().getDimensions();
    const displayDimensions = {
      width: boardDimensions.width + padding.width*2, 
      height: boardDimensions.height + padding.height*2, 
    };

    backgroundRef.current.width = 1;
    backgroundRef.current.height = 1;
    backgroundRef.current.style.width = `${displayDimensions.width}px`;
    backgroundRef.current.style.height  = `${displayDimensions.height}px`;

    boardRef.current.width = surfaceDimensions.width;
    boardRef.current.height = surfaceDimensions.height;
    boardRef.current.style.width = `${boardDimensions.width}px`;
    boardRef.current.style.height = `${boardDimensions.height}px`;
    boardRef.current.style.left = `${padding.width}px`;
    boardRef.current.style.top = `${padding.height}px`;
  }

  function setDisplayScroll() {
    if (!viewportRef.current || !boardRef.current|| !scene) {
      return;
    }
    
    const scrollDistance = scene.getScrollPositionPercentage();
    const maxScrollWidth = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
    const maxScrollHeight = viewportRef.current.scrollHeight - viewportRef.current.clientHeight;
    const scrollLeft = maxScrollWidth*scrollDistance.x;
    const scrollTop = maxScrollHeight*scrollDistance.y;

    viewportRef.current.scrollLeft = scrollLeft;
    viewportRef.current.scrollTop = scrollTop;
  }

  function drawSurface() {
    if (!boardRef?.current || !viewportRef?.current || !backgroundRef.current) {
      return;
    }

    const boardCtx = boardRef.current.getContext("2d");
    const backgroundCtx = backgroundRef.current.getContext("2d");
    const displayWidth = boardRef.current.scrollWidth;
    const displayHeight = boardRef.current.scrollHeight;

    if (!boardCtx || !backgroundCtx) { 
        throw new Error("Could not get board context");
    }

    if (!scene) { 
        boardCtx.fillStyle = "white";
        boardCtx?.fillRect(0 , 0, displayWidth, displayHeight);
        return;
    }

    const surface = scene.getSurface();
    const bitmap = surface.getBitmap();
    const surfaceDimensions = surface.getDimensions();

    backgroundCtx.fillStyle = "#363737";
    backgroundCtx.fillRect(0, 0, 1, 1);

    const idata = new ImageData(bitmap, surfaceDimensions.width, surfaceDimensions.height);
    boardCtx.putImageData(idata, 0, 0);

  }


  useEffect(() => {
    setScenePadding();
    adjustDisplayResolution();
    setDisplayScroll();
    drawSurface();
  }, [scene, boardRef, viewportRef, cursorRef, backgroundRef, scenePadding]);



  useEffect(() => {
    if (!backgroundRef.current || !viewportRef.current || !cursorRef.current) {
      return;
    }

    const display = backgroundRef.current;
    if (scene) {
      display.onmousedown = (e) => actionSubscriber?.play(DisplayActions.ON_MOUSE_DOWN, getMousePayload(e, scene));
      display.onmouseup = (e) => actionSubscriber?.play(DisplayActions.ON_MOUSE_UP, getMousePayload(e, scene));
      display.onclick = (e) => actionSubscriber?.play(DisplayActions.ON_CLICK, getMousePayload(e, scene));
      display.onmousemove = (e) => actionSubscriber?.play(DisplayActions.ON_MOUSE_MOVE, getMousePayload(e, scene));
      display.onmouseleave = (e) => actionSubscriber?.play(DisplayActions.ON_MOUSE_EXIT, getMousePayload(e, scene));
      display.onmouseenter = (e) => actionSubscriber?.play(DisplayActions.ON_MOUSE_ENTER, getMousePayload(e, scene));
    }

  }, [boardRef, cursorRef, scene]);

  
  function updateCursorPosition(e: React.MouseEvent) {
    if (!cursorRef.current || !viewportRef.current) {
      return;
    }

    const cursor = cursorRef.current;

    if (!cursor.style.display || cursor.style.display === "none") {
      return;
    }

    const mouseX = Math.floor(e.nativeEvent.offsetX);
    const mouseY = Math.floor(e.nativeEvent.offsetY);
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }


  console.log('canvas pointer: ' + activeTool.toolPointer)
  const displayPadding = scene?.getPaddingDimensions() || {width: 0, height: 0};
  return (
      <div className="w-full h-full relative">
        <div 
          className="inset-0 absolute overflow-scroll scroll"
          ref={viewportRef}
          onMouseMove={(e) => updateCursorPosition(e)}
          onScroll={(e) => {
            recordScrollDebounce();
            if (scene) {
              actionSubscriber?.play(DisplayActions.ON_SCROLL, getScrollPayload(e, scene));
            }
            
          }}
        >
          <canvas 
            ref={backgroundRef}
            id="background"
            style={{  
              cursor: `${activeTool.toolPointer}`,
            }}
          />
          <canvas 
            ref={boardRef} 
            id="drawable-display"
            className="absolute pointer-events-none"
            style={{  
              cursor: `${activeTool.toolPointer}`,
            }}
          />
          <BrushCursor 
            size={(toolSettings.brushSize ?? 10) * (scene?.getZoom() ?? 1)} 
            ref={cursorRef}
          />
      </div>
    </div>
  )
};

DrawableDisplay.displayName = 'DrawableDisplay';