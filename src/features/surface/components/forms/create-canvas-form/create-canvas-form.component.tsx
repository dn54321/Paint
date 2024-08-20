
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertDialogCancel, AlertDialogFooter } from "../../../../../components/ui/alert-dialog";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { useScene } from "../../../../camera/hooks/use-scene.hook";
import { LayerDirectoryService } from "../../../../layer/services/layer-directory.service";
import { LayerFactory } from "../../../../layer/services/layer.factory";
import { Surface } from "../../../entities/surface.entity";
import { CreateSceneFormSubmit } from "../../dialog/create-scene-dialog/create-scene-dialog.component";
import { scenePresets } from "../../../utils/constants.utils";
import { Scene } from "../../../../camera/entities/scene.entity";


export interface CreateSceneFormProps {
    onPostSubmit?: (data: CreateSceneFormSubmit) => void;
}

export function CreateSceneForm(props: CreateSceneFormProps) {
    const [scenePreset, selectScenePreset] = useState('Custom');
    const { handleSubmit, register, setValue, watch } = useForm<CreateSceneFormSubmit>({ reValidateMode: 'onChange'});
    const [sceneWidth, sceneHeight] = watch(['width', 'height'], {width: 0, height: 0});
    const {addScene, setActiveScene} = useScene();
    const onPresetChange = (value: string) => {
        const preset = scenePresets.find(item => item.name === value);
        if (!preset) {
            throw new Error("Invalid Preset");
        }

        if (preset.height && preset.width) {
            setValue("height", preset.height);
            setValue("width", preset.width);
        }

        selectScenePreset(preset.name);
    }

    const onCreateSceneSubmit = (data: CreateSceneFormSubmit) => {
        setTimeout(() => {
            const surface = new Surface(
                new LayerFactory(), 
                new LayerDirectoryService(), 
                data.height, data.width, data.name
            )
            const scene = new Scene(
                surface, {
                    scrollPositions: {x: 0.5, y: 0.5},
                    zoom: 0.95
                }
            )

            addScene(scene);
            setActiveScene(scene);
        }, 0);

        if (props.onPostSubmit) {
            props.onPostSubmit(data);
        }
    }

    return (
        <form className="flex flex-col gap-2" onSubmit={
            handleSubmit(onCreateSceneSubmit) 
        }>
            <small className="font-medium text-sm text-muted-foreground">General</small>
            <div className="flex gap-3 items-center">
                <Label>Name</Label>
                <Input type="string" id="name" required {...register("name")}/>
            </div>  
            <small className="font-medium text-sm text-muted-foreground mt-5">Scene Dimensions</small>
            <div className="flex gap-3">
                <div className="flex flex-col gap-2 w-30">
                     <div className="flex gap-3 items-center w-60">
                        <Label className="w-10">Preset</Label>
                        <Select name="preset" value={scenePreset} onValueChange={onPresetChange}>
                            <SelectTrigger className="w-fill">
                                <SelectValue placeholder="Select Preset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Common Presets</SelectLabel>
                                {scenePresets.map((preset => 
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
                                selectScenePreset("Custom"); 
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
                                selectScenePreset("Custom"); 
                                setValue('height', Number(e.currentTarget.value))
                            }}
                        />
                    </div>
                </div>
                <div className="grow overflow-hidden">
                    <Card className="h-full w-full grid place-items-center">
                        <div className="bg-orange-100" style={{
                            width: `calc(${sceneWidth}px / 20)`,
                            height: `calc(${sceneHeight}px / 20)`,
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