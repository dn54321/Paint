import { hsvaToHex } from '@uiw/color-convert';
import { HsvaColor, HsvColor } from 'colord';
import { Palette } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../../../components/ui/toggle-group";
import { CircleColorWheel } from "../../../../color/components/ui/circle-color-wheel/circle-color-wheel.component";
import { ColorState } from '../../../../color/types/color.type';
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";

export interface ColorPickerWidgetProps {
    primaryColor: HsvaColor | HsvColor,
    secondaryColor: HsvaColor | HsvColor,
    colorState: ColorState
    setColorState: (colorState: ColorState) => void,
    setColor: (color: HsvaColor | HsvColor, colorState?: ColorState) => void
}  

export function ColorPickerWidget(props: ColorPickerWidgetProps) { 
    const color = props.colorState === ColorState.PRIMARY ? props.primaryColor : props.secondaryColor;

    return (
        <ToolWidget title="Color Picker" icon={<Palette/>} >
            <div className="w-full flex flex-col place-items-center relative gap-2">
                <ToggleGroup  
                    type="single" 
                    className="flex gap-0"
                    value={props.colorState} 
                    onValueChange={v => v && props.setColorState(v)}
                >
                    <ToggleGroupItem value={ColorState.PRIMARY}
                        onClick={() => props.setColorState(ColorState.PRIMARY)}
                        style={{background: hsvaToHex({a: 1, ...props.primaryColor})}}
                        className="w-12 h-4 border data-[state=on]:border-foreground rounded-sm"
                    />
                    <ToggleGroupItem value={ColorState.SECONDARY}
                        onClick={() => props.setColorState(ColorState.SECONDARY)}
                        style={{background: hsvaToHex({a: 1, ...props.secondaryColor})}}
                        className="w-12 h-4 border data-[state=on]:border-foreground rounded-sm"
                    />
                </ToggleGroup>

                <CircleColorWheel 
                    color={color} 
                    setColor={props.setColor}
                />

            </div>
        </ToolWidget>
    )
}