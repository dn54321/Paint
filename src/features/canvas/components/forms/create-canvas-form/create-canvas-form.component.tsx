
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertDialogCancel, AlertDialogFooter } from "../../../../../components/ui/alert-dialog";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { LayerDirectoryService } from "../../../../layer/services/layer-directory.service";
import { LayerFactory } from "../../../../layer/services/layer.factory";
import { Canvas } from "../../../entities/canvas.entity";
import { useCanvas } from "../../../hooks/use-canvas.hook";
import { canvasPresets } from "../../../utils/constants.utils";
import { CreateCanvasFormSubmit } from "../../dialog/load-canvas-dialog/load-canvas-dialog";

export interface CreateCanvasFormProps {
    onPostSubmit?: (data: CreateCanvasFormSubmit) => void;
}

export function CreateCanvasForm(props: CreateCanvasFormProps) {
    const [canvasPreset, selectCanvasPreset] = useState('Custom');
    const {  handleSubmit, register, setValue, watch } = useForm<CreateCanvasFormSubmit>({ reValidateMode: 'onChange'});
    const [canvasWidth, canvasHeight] = watch(['width', 'height'], {width: 0, height: 0});
    const {addCanvas, setActiveCanvas} = useCanvas();
    const onPresetChange = (value: string) => {
        const preset = canvasPresets.find(item => item.name === value);
        if (!preset) {
            throw new Error("Invalid Preset");
        }

        if (preset.height && preset.width) {
            setValue("height", preset.height);
            setValue("width", preset.width);
        }

        selectCanvasPreset(preset.name);
    }

    const onCreateCanvasSubmit = (data: CreateCanvasFormSubmit) => {
        setTimeout(() => {
            const canvas = new Canvas(
                new LayerFactory(), 
                new LayerDirectoryService(), 
                data.height, data.width, data.name
            )
            addCanvas(canvas);
            setActiveCanvas(canvas);
        }, 0);

        if (props.onPostSubmit) {
            props.onPostSubmit(data);
        }
    }

    return (
        <form className="flex flex-col gap-2" onSubmit={
            handleSubmit(onCreateCanvasSubmit) 
        }>
            <small className="font-medium text-sm text-muted-foreground">General</small>
            <div className="flex gap-3 items-center">
                <Label>Name</Label>
                <Input type="string" id="name" required {...register("name")}/>
            </div>  
            <small className="font-medium text-sm text-muted-foreground mt-5">Canvas Dimensions</small>
            <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-30">
                     <div className="flex gap-3 items-center w-60">
                        <Label className="w-10">Preset</Label>
                        <Select name="preset" value={canvasPreset} onValueChange={onPresetChange}>
                            <SelectTrigger className="w-fill">
                                <SelectValue placeholder="Select Preset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Common Presets</SelectLabel>
                                {canvasPresets.map((preset => 
                                    <SelectItem value={preset.name} key={preset.name}>{preset.name}</SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-3 items-center w-60">
                        <Label className="w-10">Width</Label>
                        <Input 
                            type="number" 
                            id="width"
                            className="w-fill" 
                            endAdornment="px"
                            required 
                            {...register("width")}
                            onChange={(e) => {
                                selectCanvasPreset("Custom"); 
                                setValue('width', Number(e.currentTarget.value))
                            }}
                        />
                    </div>
                    <div className="flex gap-3 items-center w-60">
                        <Label className="w-10">Height</Label>
                        <Input 
                            type="number" 
                            id="height"
                            className="w-fill" 
                            endAdornment="px" 
                            required
                            {...register("height")}
                            onChange={(e) => {
                                selectCanvasPreset("Custom"); 
                                setValue('height', Number(e.currentTarget.value))
                            }}
                        />
                    </div>
                </div>
                <div className="grow overflow-hidden">
                    <Card className="h-full w-full grid place-items-center">
                        <div className="bg-orange-100" style={{
                            width: `calc(${canvasWidth}px / 20)`,
                            height: `calc(${canvasHeight}px / 20)`,
                        }}/>
                    </Card>
                </div>
            </div>
            <AlertDialogFooter className="sm:justify-start mt-5">
                <Button type="submit">Continue</Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </form>
    )
}