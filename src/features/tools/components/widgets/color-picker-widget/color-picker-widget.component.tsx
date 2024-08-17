import { useState } from "react";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";
import { hsvaToHex } from '@uiw/color-convert';
import Wheel from '@uiw/react-color-wheel'
import { Palette } from "lucide-react";
import ShadeSlider from '@uiw/react-color-shade-slider';
import { ToggleGroup, ToggleGroupItem } from "../../../../../components/ui/toggle-group";
import { CircleColorWheel } from "../../../../color/components/ui/circle-color-wheel/circle-color-wheel.component";

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
                {/* <Wheel
                    color={{...colorPalette[colorState], a:1}}
                    className={"rounded-full"}
                    onChange={(color) => {
                        setColorPalette((prevColorPalette) => {
                            const newColorPalette = [...prevColorPalette];
                            newColorPalette[colorState] = color.hsva;
                            return newColorPalette;
                        });
                    }}
                /> */}
                <CircleColorWheel/>
                <div className="flex flex-col w-full px-5 my-2 gap-1 items-center">
                    <ShadeSlider
                        radius="9px"
                        hsva={colorPalette[colorState]}
                        className="w-full"
                        onChange={(newShade) => {
                            setColorPalette((prevColorPalette) => {
                                const newColorPalette = [...prevColorPalette];
                                newColorPalette[colorState] = {...newColorPalette[colorState], ...newShade};
                                return newColorPalette;
                            });
                        }}
                    />
                </div>
            </div>
        </ToolWidget>
    )
}