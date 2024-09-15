import { Hammer } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../../../components/ui/toggle-group";
import { Subtool } from "../../../types/tool.types";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";
import { ToolSlice } from "../../../slices/tools.slice";

export interface ToolOptionWidgetProps{
    activeSubtool?: string,
    setActiveSubtool?: ToolSlice['setActiveSubtool'];
    subtools?: Array<Subtool>
}

export function SubtoolPickerWidget({
    activeSubtool = "",
    setActiveSubtool = () => {},
    subtools = []
}: ToolOptionWidgetProps) {
    return (
        <ToolWidget title="Subtool Menu" icon={<Hammer/>} >
            <ToggleGroup 
                type="single" 
                variant="outline" 
                value={activeSubtool}
                onValueChange={(value) => value && setActiveSubtool(value)}
                className="flex flex-col gap-0"
            >
                {subtools.map(subtool => (
                    <ToggleGroupItem 
                        value={subtool.key} 
                        key={subtool.key} 
                        className="w-full m-0 justify-start flex gap-3 border-x-0 not-first:border-t-1 rounded-none"
                    >
                        {subtool.icon}
                        <small className=".small">Tool: {subtool.name}</small>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </ToolWidget>

    )
}