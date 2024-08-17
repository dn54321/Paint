import { Eye, EyeOff, Layers } from "lucide-react";
import { Separator } from "../../../../../components/ui/separator";
import { ToolWidget } from "../../../../tools/components/container/tool-widget/tool-widget.component";


export interface LayerListItemProps {
    visible: boolean
    name: string
}
export function LayerListItem(props: LayerListItemProps) {
    return (
        <div className="h-full">
                <div className="flex place-items-center">
                    <div className="grid place-self-center p-2">
                        {props.visible ? <Eye /> : <EyeOff />}
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div className="h-8 w-16 bg-gray-900 mx-2"/>
    
                    <div>
                        {props.name}    
                    </div>
                </div>
                <Separator/>
        </div>
    )
}

export interface LayerWidgetProps {}
export default function LayerWidget() {
    return (
        <ToolWidget title="Layers" icon={<Layers/>}>
            <div className="flex flex-col">
                <Separator/>
                <LayerListItem visible={true} name={"testLayer1"}/>
                
                <LayerListItem visible={false} name={"testLayer2"}/>
            </div>
        </ToolWidget>
    )
}