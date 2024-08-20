import { hsvaToHex } from '@uiw/color-convert';
import { Palette } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../../../../../components/ui/toggle-group";
import { CircleColorWheel } from "../../../../color/components/ui/circle-color-wheel/circle-color-wheel.component";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";

export function ColorPickerWidget() {
    const [colorState, setColorState] = useState(0);
    const [colorPalette, setColorPalette] = useState([
        { h: 0, s: 0, v: 100, a: 1 },
        { h: 0, s: 0, v: 100, a: 1 }
    ]);

    
    return (
        <ToolWidget title="Color Picker" icon={<Palette/>} >
            <div className="w-full flex flex-col place-items-center relative gap-2">
                <ToggleGroup  
                    type="single" 
                    className="flex gap-0"
                    value={colorState.toString()} 
                    onValueChange={v => v && setColorState(Number(v))}
                >
                    <ToggleGroupItem value="0"
                        onClick={() => setColorState(0)}
                        style={{background: hsvaToHex(colorPalette[0])}}
                        className="w-12 h-4 border data-[state=on]:border-foreground rounded-sm"
                    />
                    <ToggleGroupItem value="1"
                        onClick={() => setColorState(1)}
                        style={{background: hsvaToHex(colorPalette[1])}}
                        className="w-12 h-4 border data-[state=on]:border-foreground rounded-sm"
                    />
                </ToggleGroup>

                <CircleColorWheel/>

            </div>
        </ToolWidget>
    )
}