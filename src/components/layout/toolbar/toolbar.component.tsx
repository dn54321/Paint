import { Fullscreen, Loader, Ratio, Redo, Undo, ZoomIn, ZoomOut } from "lucide-react";
import React from "react";
import { Scene } from "../../../features/display/entities/scene.entity";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Separator } from "../../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { Dimension } from "../../../types/geometry.types";
import { fitBoundingBox } from "../../../features/display/utils/camera.utils";

export interface ToolbarIconButtonProps {
    tooltip: string
    icon: React.ReactElement
    onClick?: () => void
    disabled?: boolean
}

export function ToolbarIconButton(props: ToolbarIconButtonProps) {
    return (
        <TooltipProvider>
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={props.onClick} 
                disabled={props.disabled}
            >
                {props.icon}
            </Button>
            </TooltipTrigger>
            <TooltipContent>
            <p>{props.tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    )
}

export interface ToolbarProps {
    scene?: Scene,
    scaleZoomDimension?: Dimension,
}  
export default function Toolbar(props: ToolbarProps) {
    const zoomOptions = [0.25, 0.50, 0.75, 0.95, 1, 1.25, 1.5, 2, 3, 4];
    const scene = props.scene;

    return (
        <Card className="flex rounded-none border-t-0 border-l-0 bg-muted/10">
            <ToolbarIconButton 
                icon={<Undo className="h-4 w-4" aria-label="Undo"/>} 
                tooltip={"Undo (Ctrl+Z)"}
            />
            <ToolbarIconButton 
                icon={<Redo className="h-4 w-4" aria-label="Redo"/>} 
                tooltip={"Redo (Ctrl+Shift+Z)"}
            />
            <Separator orientation="vertical"/>
            <Select
                value='auto'
                onValueChange={(v) => {
                    if (Number(v) !== scene?.getZoom()) {
                        scene?.setZoom(Number(v));
                    }
    
                    return 'auto';
                }}
            >
                <SelectTrigger className="w-20 h-8 ml-3 my-auto">
                    <SelectValue placeholder={scene ? `${Math.round(scene.getZoom()*100)}%` : 'N/A'}/>
                </SelectTrigger>
                <SelectContent>
                    {zoomOptions.map((v) =>
                        <SelectItem value={v.toString()} key={v}>{v*100}%</SelectItem>
                    )}
                    <SelectItem 
                        value={'auto'} 
                        key={'auto'}
                        className="hidden"
                    >{scene ? `${Math.round(scene.getZoom() * 100)}%` : 'N/A'}</SelectItem>
                </SelectContent>
            </Select>
            <ToolbarIconButton 
                icon={<ZoomIn className="h-4 w-4" aria-label="Zoom In"/>} 
                tooltip={"Zoom In"}
                onClick={() => {
                    scene?.setZoom(scene.getZoom() + 0.1)
                }}
                disabled={Boolean(!scene || scene.getZoom() >= 16)}
            />
            <ToolbarIconButton 
                icon={<ZoomOut className="h-4 w-4" aria-label="Zoom Out" />} 
                tooltip={"Zoom Out"}
                onClick={() => scene?.setZoom(scene.getZoom() - 0.1)}
                disabled={Boolean(!scene || scene.getZoom() <= 0.1)}
            />
            <Separator orientation="vertical"/>
            <ToolbarIconButton
                icon={<Ratio className="h-4 w-4" aria-label="Center Camera"/>}
                tooltip={"Re-Center Camera"}
                disabled={!scene}
                onClick={() => {
                    scene?.setScrollPositionPercentage({x: 0.5, y: 0.5});
                }}
            />
            <ToolbarIconButton
                icon={<Fullscreen className="h-4 w-4" aria-label="Reset Camera Perspective"/>}
                tooltip={"Reset Camera Perspective"}
                disabled={!(scene && props.scaleZoomDimension)}
                onClick={() => {
                    if (!scene || !props.scaleZoomDimension) {
                        return;
                    }

                    const viewportDimension = props.scaleZoomDimension;
                    const surfaceDimension = scene.getSurface().getDimensions();
                    const boundingBox = fitBoundingBox(surfaceDimension, viewportDimension);
                    const zoom = boundingBox.width/surfaceDimension.width;
                    scene?.setScrollPositionPercentage({x: 0.5, y: 0.5});
                    scene?.setZoom(zoom);
                }}
            />
            <ToolbarIconButton 
                icon={<Loader className="h-4 w-4" aria-label="Clear Canvas"/>} 
                tooltip={"Clear Canvas"}
            />
        </Card>
    )
}