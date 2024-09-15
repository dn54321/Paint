import { Palette } from "lucide-react";
import { ToolWidget } from "../../container/tool-widget/tool-widget.component";

export interface NavigatorWidgetProps {

}  

export function NavigatorWidget(props: NavigatorWidgetProps) { 

    return (
        <ToolWidget title="Color Picker" icon={<Palette/>} >
            <div className="w-full flex flex-col place-items-center relative gap-2">
                test
            </div>
        </ToolWidget>
    )
}