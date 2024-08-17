import { Settings } from "lucide-react";
import { Slider } from "../../../../../components/ui/slider";
import { ToolSliceAction } from "../../../slices/tools.slice";
import { ToolFormComponent, ToolFormComponents, ToolSlider } from "../../../types/tool-forms.types";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";

export interface ToolOptionsWidgetProps {
    formComponents: Array<ToolFormComponent>,
}

export interface ToolFormComponentStore {
    toolSettings: Record<string, number | string>
    setToolSetting: ToolSliceAction['setToolSetting']
}

export function ToolFormSlider(props: ToolSlider & ToolFormComponentStore) {
    const attributeValue = Number(props.toolSettings[props.handle]);
    return (
        <div className="flex items-center w-full p-1 gap-4">
            <p className="small whitespace-nowrap w-36">{props.name}</p>
            <Slider 
                className="grow" 
                value={[attributeValue]} 
                onValueChange={e => props.setToolSetting(props.handle, e[0])}  
                max={props.max}  
                min={props.min}
                step={props.step ?? 1}
            />
            <input className="w-11 border pl-1" 
                type="number" 
                value={attributeValue} 
                onChange={e => props.setToolSetting(props.handle, Number(e.target.value))}
            />
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