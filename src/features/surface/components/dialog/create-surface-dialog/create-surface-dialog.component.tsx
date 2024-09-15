
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../../../../components/ui/alert-dialog";

import { DialogProps } from "@radix-ui/react-dialog";
import { CreateSceneForm } from "../../forms/create-surface-form/create-surface-form.component";
import { Scene } from "../../../../display/entities/scene.entity";
import { Surface } from "../../../entities/surface.entity";
import { useScene } from "../../../../display/hooks/use-scene.hook";
import { fitBoundingBox } from "../../../../display/utils/camera.utils";
import { Dimension } from "../../../../../types/geometry.types";

export interface CreateSceneFormSubmit {
    width: number,
    height: number,
    name: string,
}

export interface CreateSceneDialogProps extends DialogProps {
    scaleZoomDimension?: Dimension
}

export function CreateSceneDialog(props: CreateSceneDialogProps) {
    const [createSceneDialogOpen, setCreateSceneDialogOpen] = useState(false);
    const {addScene, setActiveScene} = useScene();
    const defaultSceneOptions = {
        scrollPosPercentage: {x: 0.5, y: 0.5}
    }
    return (
        <AlertDialog 
            open={ props.open || createSceneDialogOpen } 
            onOpenChange={ props.onOpenChange || setCreateSceneDialogOpen }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create Surface</AlertDialogTitle>
                    <AlertDialogDescription>Please provide the name and dimensions of your surface to continue.</AlertDialogDescription>
                    <CreateSceneForm 
                        onSubmit={(surface: Surface) => {
                            const scene = new Scene(surface, defaultSceneOptions);

                            if (props.scaleZoomDimension) {
                                const viewportDimensions = props.scaleZoomDimension;
                                const surfaceDimension = scene.getSurface().getDimensions();
                                const boundingBox = fitBoundingBox(surfaceDimension, viewportDimensions);
                                const scale = boundingBox.width / surfaceDimension.width;
                                scene.setZoom(scale);
                            }

                            addScene(scene);
                            setActiveScene(scene.getId());
                            props.onOpenChange ? props.onOpenChange(false) : setCreateSceneDialogOpen(false)}
                        }
                    />
                </AlertDialogHeader>
            </AlertDialogContent>
      </AlertDialog>
    )
}