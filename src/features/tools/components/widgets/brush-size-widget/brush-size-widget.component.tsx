import { Radius } from "lucide-react"
import { ToolWidget } from "../../container/tool-widget/tool-widget.component"
import { ScrollArea } from "../../../../../components/ui/scroll-area"

const brushSizes = [
    0.7, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 
    12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 60, 70, 
    80, 90, 100, 120, 150, 170, 200, 250, 300, 400, 500, 
    600, 700, 800, 1000, 1200, 1500, 1700, 2000
]


export interface BrushSizeBoxProps {
    size: number
}
export function BrushSizeBox(props: BrushSizeBoxProps) {
    return (
        <div className="w-8 h-11 border flex flex-col items-center relative">
            <div className="grid w-full h-8 place-items-center">
                <div style={{
                    width: `min(30px,${props.size}px)`, 
                    height: `min(30px,${props.size}px)`
                }} className="rounded-full bg-foreground mt-1"/>
            </div>
            <small className="bg-background/60 absolute bottom-0 w-full text-center py-1h-3 small">{props.size}</small>
        </div>
    )
}

export default function BrushSizeWidget() {
    return (
        <ToolWidget title="Brush Size" icon={<Radius/>}>
            <ScrollArea>
                <div className="flex flex-wrap px-4 h-52">
                    {brushSizes.map(brushSize => <BrushSizeBox size={brushSize} key={brushSize}/>)}
                </div>
            </ScrollArea>
        </ToolWidget>
    )
}