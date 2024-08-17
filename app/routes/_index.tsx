import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "@src/components/layout/navbar";
import { useState } from "react";
import { ToolsSideMenu } from "../../src/components/layout/tools-side-menu";
import { useCamera } from "../../src/features/camera/hooks/use-camera";
import { CreateCanvasDialog } from "../../src/features/canvas/components/dialog/create-canvas-dialog/create-canvas-dialog.component";
import { LoadCanvasDialog } from "../../src/features/canvas/components/dialog/load-canvas-dialog/load-canvas-dialog";
import { CanvasFile, Filebar } from "../../src/features/canvas/components/ui/file-bar/file-bar.component";
import { Canvas } from "../../src/features/canvas/entities/canvas.entity";
import { useCanvas } from "../../src/features/canvas/hooks/use-canvas.hook";
import Toolbar from "../../src/components/layout/toolbar/toolbar.component";
import { LayerSideMenu } from "../../src/components/layout/layer-side-menu";

export const meta: MetaFunction = () => {
  return [
    { title: "Inkly" },
    { name: "description", content: "A place to draw together!" },
  ];
};


export default function Index() {
  const {activeCanvas, removeCanvas, setActiveCanvas, canvasList, moveCanvas} = useCanvas();
  const {Display, camera, cameraControls} = useCamera();
  const files = canvasList.map(canvas => ({name: canvas.getName(), key: canvas.getId()}));
  const [isLoadCanvasDialogOpen, setLoadCanvasDialogOpen] = useState(false);
  const canvasFileSet = canvasList.reduce<Record<string, Canvas>>(
      (hashmap, canvas) => Object.assign(hashmap, {[canvas.getId()]: canvas}), 
  {});

  return (
    <div className="flex w-full h-full flex-col">
      <Navbar/>
      <div className="flex h-full w-full overflow-hidden">
        <ToolsSideMenu/>
        <div className="w-full flex flex-col relative">
          <Toolbar camera={camera} cameraControl={cameraControls}/>
          <Display/>
          <Filebar 
            files={files} 
            active={files.find(file => activeCanvas && file.key === activeCanvas.getId())}
            onMove={(file: CanvasFile, position: number) => {
              moveCanvas(canvasFileSet[file.key], position);
            }}
            onClick={(file: CanvasFile) => {
              if (file === undefined) {
                return;
              }

              if (canvasFileSet[file.key].getId() !== activeCanvas?.getId()) {
                setActiveCanvas(canvasFileSet[file.key]);
              }
            }}
            onClose={(file: CanvasFile) => {
              removeCanvas(file && canvasFileSet[file.key]);
              if (file.key === activeCanvas?.getId() && canvasList.length)  {
                setActiveCanvas(canvasList[canvasList.length-1]);
              }
            }}
          />

        </div>
        <LayerSideMenu/>
      </div>
      <LoadCanvasDialog/>
      <CreateCanvasDialog open={isLoadCanvasDialogOpen} onOpenChange={setLoadCanvasDialogOpen}/>
    </div>
  );
}
