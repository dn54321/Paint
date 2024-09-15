import "reflect-metadata";

import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "@src/components/layout/navbar";
import { createRef, useEffect, useState } from "react";
import { LayerSideMenu } from "../../src/components/layout/layer-side-menu";
import Toolbar from "../../src/components/layout/toolbar/toolbar.component";
import { ToolsSideMenu } from "../../src/components/layout/tools-side-menu";
import { DrawableDisplay } from "../../src/features/display/components/drawable-display/drawable-display";
import { Scene } from "../../src/features/display/entities/scene.entity";
import { useScene } from "../../src/features/display/hooks/use-scene.hook";
import { CreateSceneDialog } from "../../src/features/surface/components/dialog/create-surface-dialog/create-surface-dialog.component";
import { LoadSceneDialog } from "../../src/features/surface/components/dialog/load-canvas-dialog/load-canvas-dialog";
import { Filebar, SurfaceFile } from "../../src/features/surface/components/ui/file-bar/file-bar.component";
import { useColor } from "../../src/features/color/hooks/use-color.hook";
import { Dimension } from "../../src/types/geometry.types";
import { isDimensionEqual, isPositionEqual } from "../../src/utils/math";

export const meta: MetaFunction = () => {
  return [
    { title: "Inkly" },
    { name: "description", content: "A place to draw together!" },
  ];
};


export default function Index() {
  const {activeScene, removeScene, setActiveScene, sceneList, moveScene} = useScene();
  const displayViewportRef = createRef<HTMLDivElement>();
 
  const files = sceneList.map(scene => ({name: scene.getSurface().getName(), key: scene.getId()}));
  const [isLoadSceneDialogOpen, setLoadSceneDialogOpen] = useState(false);
  const [drawableDisplayDimension, setDrawableDisplayDimension] = useState<Dimension | undefined>(undefined);
  useEffect(() => {
    if (!displayViewportRef.current) {
      return;
    }

    const dims = {
      width: displayViewportRef.current.clientWidth, 
      height: displayViewportRef.current.clientHeight
    };

    if (!drawableDisplayDimension || !isDimensionEqual(drawableDisplayDimension, dims)) {
      setDrawableDisplayDimension(dims);
    }
  }, [displayViewportRef])

  return (
    <div className="flex w-full h-full flex-col">
      <Navbar surfaceCreationSettings={{
        scaleZoomDimension: drawableDisplayDimension
      }}/>
      <div className="flex h-full w-full overflow-hidden">
        <ToolsSideMenu/>
        <div className="w-full flex flex-col relative">
          <Toolbar 
            scene={activeScene}
            scaleZoomDimension={drawableDisplayDimension}
          />
          <DrawableDisplay scene={activeScene} viewportRef={displayViewportRef}/>
          <Filebar 
            files={files} 
            active={files.find(file => activeScene && file.key === activeScene.getId())}
            onMove={(file: SurfaceFile, position: number) => moveScene(file.key, position)}
            onClick={(file: SurfaceFile) => setActiveScene(file.key)}
            onClose={(file: SurfaceFile) => {
              if (file.key === activeScene?.getId() && sceneList.length > 1)  {
                const nextScene = sceneList.findLast((scene) => scene.getId() != file.key);
                setActiveScene(nextScene?.getId());
              }
              removeScene(file.key);
            }}
          />

        </div>
        <LayerSideMenu/>
      </div>
      <LoadSceneDialog/>
      <CreateSceneDialog 
        open={isLoadSceneDialogOpen} 
        onOpenChange={setLoadSceneDialogOpen}
      />
    </div>
  );
}
