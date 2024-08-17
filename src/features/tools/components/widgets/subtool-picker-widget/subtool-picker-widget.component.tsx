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
                className="flex flex-row px-2 flex-wrap"
            >
                {subtools.map(subtool => (
                    <ToggleGroupItem 
                        value={subtool.key} 
                        key={subtool.key} 
                        className="flex items-center justify-start bg-background gap-2 flex-grow min-w-fit"
                    >
                        {subtool.icon}
                        <small className=".small">{subtool.name}</small>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </ToolWidget>

    )
}