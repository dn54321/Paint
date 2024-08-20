import { createRef, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { useMutationObserver } from "../../../../hooks/use-mutation-observer";
import { useWindowResize } from "../../../../hooks/use-window-resize";
import { useTool } from "../../../tools/hooks/use-tool.hook";
import { Camera } from "../../entities/camera.entity";
import { CameraActionSubscriber } from "../../services/camera/camera-action-subscriber.service";
import { CameraControlSubscriber } from "../../services/camera/camera-control-subscriber.service";
import { CameraActions } from "../../types/camera-action.types";
import { BrushCursor } from "../../../tools/components/ui/brush-cursor/brush-cursor.component";
import { useScene } from "../../hooks/use-scene.hook";

export interface DisplayProps {
  camera: Camera,
  actionSubscriber?: CameraActionSubscriber
  controlSubscriber?: CameraControlSubscriber
}

export function Display(props: DisplayProps) {
  const displayRef = createRef<HTMLCanvasElement>();
  const scrollRef = createRef<HTMLDivElement>();
  const cursorRef = createRef<HTMLCanvasElement>();
  const { setSceneList } = useScene();

  const recordScrollDebounce = useDebouncedCallback((camera: Camera) => {
    const oldScrollPos = camera.getActiveScene()?.getScrollPositionPercentage();
    camera.updateState();
    const newScrollPos = camera.getActiveScene()?.getScrollPositionPercentage();
    if (oldScrollPos?.x != newScrollPos?.x || oldScrollPos?.y != newScrollPos?.y) {
      setSceneList(camera.getSceneList());
    }
  }, 250);
  const [windowWidth, windowHeight] = useWindowResize();
  const { activeTool, withToolActions, toolSettings } = useTool();
  withToolActions(props.actionSubscriber);  

  useEffect(() => {
    if (!displayRef.current || !scrollRef.current || !cursorRef.current) {
      return;
    }
    console.log("Fixing Refs.");
    const display = displayRef.current
    props.camera.setDisplayRef(displayRef);
    props.camera.setScrollRef(scrollRef);

    // Probably not the right place to put this.
    display.onmousedown = (e) => props.actionSubscriber?.play(CameraActions.ON_MOUSE_DOWN, {event: e, camera: props.camera});
    display.onmouseup = (e) => props.actionSubscriber?.play(CameraActions.ON_MOUSE_UP, {event: e, camera: props.camera});
    display.onclick = (e) => props.actionSubscriber?.play(CameraActions.ON_CLICK, {event: e, camera: props.camera});
    display.onmousemove = (e) => props.actionSubscriber?.play(CameraActions.ON_MOUSE_MOVE, {event: e, camera: props.camera, cursorRef});
    display.onmouseleave = (e) => props.actionSubscriber?.play(CameraActions.ON_MOUSE_EXIT, {event: e, camera: props.camera, cursorRef});
    display.onmouseenter = (e) => props.actionSubscriber?.play(CameraActions.ON_MOUSE_ENTER, {event: e, camera: props.camera, cursorRef});
    if (props.camera.getActiveScene()) {
      props.camera.rescaleCamera();
      props.camera.adjustCameraScroll();
      props.camera.draw();
    }
  }, [displayRef, scrollRef, cursorRef]);

  useMutationObserver(scrollRef, () => {
    console.log("Calling camera control subscriber.");
    if (props.controlSubscriber) {
      const scene = props.camera.getActiveScene();
      if (scene) {
        props.controlSubscriber.play(scene);
      }
    }
  });

  useEffect(() => { // Adjust camera and scroll upon window size changing
    console.log("Detected canvas resize event. Resizing canvas.")
    if (!scrollRef.current) {
      return;
    }

    if (props.camera.getActiveScene()) {
      props.camera.rescaleCamera();
      props.camera.adjustCameraScroll();
      props.camera.draw();
    }
  }, [windowWidth, windowHeight]);

  console.log('canvas pointer: ' + activeTool.toolPointer)

  return (
      <div className="w-full h-full relative">
        <div 
          className="inset-0 absolute overflow-scroll scroll"
          ref={scrollRef}
          onScroll={(e) => {
            recordScrollDebounce(props.camera);
            props.actionSubscriber?.play(CameraActions.ON_SCROLL, {event: e, camera: props.camera, cursorRef});
          }}
        >
          <BrushCursor size={ (toolSettings.brushSize ?? 10) * (props.camera.isReady() ? props.camera.getZoom() : 1)} ref={cursorRef}/>
          <canvas 
            ref={displayRef} 
            id="paint-main"

            style={{  
              cursor: `${activeTool.toolPointer}`,
              width: "100%",
              height: "100%"  
            }}
          />
      </div>
    </div>
  )
}