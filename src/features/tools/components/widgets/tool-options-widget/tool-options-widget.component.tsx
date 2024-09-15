import { Settings } from "lucide-react";
import { Slider } from "../../../../../components/ui/slider";
import { ToolSliceAction } from "../../../slices/tools.slice";
import { ToolFormComponent, ToolFormComponents, ToolSlider } from "../../../types/tool-forms.types";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface ToolOptionsWidgetProps {
    formComponents: Array<ToolFormComponent>,
}

export interface ToolFormComponentStore {
    toolSettings: Record<string, number | string>
    setToolSetting: ToolSliceAction['setToolSetting']
}

export function ToolFormSlider(props: ToolSlider & ToolFormComponentStore) {
    const persistedValue = Number(props.toolSettings[props.handle]);
    const [value, setValue] = useState(persistedValue);
    const saveValue = useDebouncedCallback((value: number) => {
            props.setToolSetting(props.handle, value)
    }, 100);

    useEffect(() => {
        if (persistedValue != value) {
            setValue(persistedValue);
        }
    }, [persistedValue])

    return (
        <div className="flex flex-col w-full p-1">
            <p className="small leading-normal">{props.name}</p>
            <div className="flex justify-between align-middle w-full gap-3">
                <Slider 
                    className="grow" 
                    value={[value]} 
                    onValueChange={e => {
                        setValue(e[0]);
                        saveValue(e[0]);
                    }}  
                    max={props.max}  
                    min={props.min}
                    step={props.step ?? 1}
                />
                <input className="w-14 border pl-1" 
                    type="number" 
                    value={value} 
                    onChange={e => {
                        setValue(Number(e.target.value));
                        saveValue(Number(e.target.value));
                    }}
                />

            </div>
        </div>
    )
}

export function ToolOptionsWidget(props: ToolOptionsWidgetProps & ToolFormComponentStore) {
    return (
        <ToolWidget title="Tool Options" icon={<Settings />}>
            <div className="ml-1">
                {
                    props.formComponents.map((field) => {
                        switch(field.type) {
                            case ToolFormComponents.SLIDER: 
                                return <ToolFormSlider 
                                    {...field} 
                                    key={field.handle}
                                    toolSettings={props.toolSettings} 
                                    setToolSetting={props.setToolSetting}
                                />
                        }
                    })
                }
            </div>
        </ToolWidget>
    )
}