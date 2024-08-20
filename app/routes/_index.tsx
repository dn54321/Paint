import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "@src/components/layout/navbar";
import { useState } from "react";
import { LayerSideMenu } from "../../src/components/layout/layer-side-menu";
import Toolbar from "../../src/components/layout/toolbar/toolbar.component";
import { ToolsSideMenu } from "../../src/components/layout/tools-side-menu";
import { Scene } from "../../src/features/camera/entities/scene.entity";
import { useScene } from "../../src/features/camera/hooks/use-scene.hook";
import { CreateSceneDialog } from "../../src/features/surface/components/dialog/create-scene-dialog/create-scene-dialog.component";
import { Filebar, SurfaceFile } from "../../src/features/surface/components/ui/file-bar/file-bar.component";
import { LoadSceneDialog } from "../../src/features/surface/components/dialog/load-canvas-dialog/load-canvas-dialog";
import { useDisplay } from "../../src/features/camera/hooks/use-display.hook";

export const meta: MetaFunction = () => {
  return [
    { title: "Inkly" },
    { name: "description", content: "A place to draw together!" },
  ];
};


export default function Index() {
  const {activeScene, removeScene, setActiveScene, sceneList, moveScene} = useScene();
  const {Display, camera, cameraControls} = useDisplay();
  const files = sceneList.map(scene => ({name: scene.getSurface().getName(), key: scene.getId()}));
  const [isLoadSceneDialogOpen, setLoadSceneDialogOpen] = useState(false);
  const sceneFileSet = sceneList
    .reduce<Record<string, Scene>>(
      (hashmap, scene) => Object.assign(hashmap, {[scene.getId()]: scene}), 
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
            active={files.find(file => activeScene && file.key === activeScene.getId())}
            onMove={(file: SurfaceFile, position: number) => {
              moveScene(sceneFileSet[file.key], position);
            }}
            onClick={(file: SurfaceFile) => {
              if (file === undefined) {
                return;
              }

              if (sceneFileSet[file.key].getId() !== activeScene?.getId()) {
                setActiveScene(sceneFileSet[file.key]);
              }
            }}
            onClose={(file: SurfaceFile) => {
              removeScene(file && sceneFileSet[file.key]);
              if (file.key === activeScene?.getId() && sceneList.length)  {
                setActiveScene(sceneList[sceneList.length-1]);
              }
            }}
          />

        </div>
        <LayerSideMenu/>
      </div>
      <LoadSceneDialog/>
      <CreateSceneDialog open={isLoadSceneDialogOpen} onOpenChange={setLoadSceneDialogOpen}/>
    </div>
  );
}
