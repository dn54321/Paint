import { Fullscreen, Loader, Redo, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import React, { useEffect, useState } from "react";
import { Camera } from "../../../features/camera/entities/camera.entity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { CameraControlSubscriber } from "../../../features/camera/services/camera/camera-control-subscriber.service";

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
    camera: Camera,
    cameraControl: CameraControlSubscriber
}

export default function Toolbar(props: ToolbarProps) {
    const [zoom, setZoom] = useState<number | undefined>(undefined);
    console.log("Current zoom: " + zoom);
    useEffect(() => {
        props.cameraControl.subscribe('TOOLBAR_SUBSCRIBER',(payload) => {
            setZoom(payload.zoom);
        })
    }, []);
    const zoomOptions = [0.25, 0.50, 0.75, 0.95, 1, 1.25, 1.5, 2, 3, 4];
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
                    if (Number(v) !== props.camera.getZoom()) {
                        props.camera.setCameraZoom(Number(v));
                    }
    
                    return 'auto';
                }}
            >
                <SelectTrigger className="w-20 h-8 ml-3 my-auto">
                    <SelectValue placeholder={zoom ? `${Math.round(zoom*100)}%` : 'N/A'}/>
                </SelectTrigger>
                <SelectContent>
                    {zoomOptions.map((v) =>
                        <SelectItem value={v.toString()} key={v}>{v*100}%</SelectItem>
                    )}
                    <SelectItem 
                        value={'auto'} 
                        key={'auto'}
                        className="hidden"
                    >{props.camera.isReady() && `${Math.round(props.camera.getZoom()*100)}%` || 'N/A'}</SelectItem>
                </SelectContent>
            </Select>
            <ToolbarIconButton 
                icon={<ZoomIn className="h-4 w-4" aria-label="Zoom In"/>} 
                tooltip={"Zoom In"}
                onClick={() => props.camera.zoomCamera(0.1)}
                disabled={Boolean(props.camera.isReady() && props.camera.getZoom() >= 16)}
            />
            <ToolbarIconButton 
                icon={<ZoomOut className="h-4 w-4" aria-label="Zoom Out" />} 
                tooltip={"Zoom Out"}
                onClick={() => props.camera.zoomCamera(-0.1)}
                disabled={Boolean(props.camera.isReady() && props.camera.getZoom() <= 0.1)}
            />
            <Separator orientation="vertical"/>
            <ToolbarIconButton
                icon={<Fullscreen className="h-4 w-4" aria-label="Reset Camera Perspective"/>}
                tooltip={"Re-center Camera"}
                onClick={() => {
                    props.camera.setCameraZoom(0.95);
                    props.camera.centerCamera();
                }}
            />
            <ToolbarIconButton 
                icon={<Loader className="h-4 w-4" aria-label="Clear Canvas"/>} 
                tooltip={"Clear Canvas"}
            />
        </Card>
    )
}