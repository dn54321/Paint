import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group';
import { BoxSelect, Brush, Eraser, Hand, Search } from "lucide-react";
import BrushSizeWidget from '../../../features/tools/components/widgets/brush-size-widget/brush-size-widget.component';
import { ColorPickerWidget } from '../../../features/tools/components/widgets/color-picker-widget/color-picker-widget.component';
import { SubtoolPickerWidget } from '../../../features/tools/components/widgets/subtool-picker-widget/subtool-picker-widget.component';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { useTool } from '../../../features/tools/hooks/use-tool.hook';
import { Tools } from '../../../features/tools/types/tool.types';
import { ToolOptionsWidget } from '../../../features/tools/components/widgets/tool-options-widget/tool-options-widget.component';
import { Resizable } from 're-resizable';
import { useColor } from '../../../features/color/hooks/use-color.hook';

export default function ToolsSideMenu() {
    const {activeTool, setActiveTool, settingsTemplate, toolSettings, setToolSetting} = useTool();
    const {primaryColor, secondaryColor, colorState, setColor, setColorstate } = useColor();
    const tools = [
        {
            name: Tools.HAND,
            icon: <Hand size={24} strokeWidth={1.25} />
        },
        {
            name: Tools.MAGNIFY,
            icon: <Search size={24} strokeWidth={1.25} />
        },
        {
            name: Tools.BRUSH,
            icon: <Brush size={24} strokeWidth={1.25} />
        },
        {
            name: Tools.ERASER,
            icon: <Eraser size={24} strokeWidth={1.25} />
        },
        {
            name: Tools.SELECT,
            icon: <BoxSelect size={24} strokeWidth={1.25} />
        }
    ]

    return (
        <aside className="inset-y-0 left-0 hidden border-r bg-muted/10 sm:flex z-0 ">
            <nav className="flex flex-col items-center gap-4 pt-2 h-full border-r">
                <ToggleGroup
                    className="ToggleGroup flex flex-col gap-1"
                    type="single"
                    value={activeTool.name}
                    onValueChange={(value) => value && setActiveTool(value)}
                    aria-label="Tools"
                >
                    {tools.map(activeTool => (
                        <TooltipProvider 
                            key={activeTool.name}
                            delayDuration={0}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <ToggleGroupItem 
                                            value={activeTool.name} 
                                            aria-label={activeTool.name}   
                                            size="sm"
                                        >
                                            {activeTool.icon}
                                        </ToggleGroupItem>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                <p className="p capitalize">{activeTool.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    ))}
                </ToggleGroup>
            </nav>
                <Resizable 
                    defaultSize={{width: "64rem"}} 
                    minWidth="200px"
                    className="w-64 flex flex-col items-center"
                    enable={{ right:true }}
                >
                    <SubtoolPickerWidget
                        subtools={activeTool.subtools} 
                        setActiveSubtool={activeTool.setActiveSubtool as ((subtool: string) => void)} 
                        activeSubtool={activeTool.activeSubtool}
                    />
                    <ToolOptionsWidget
                        formComponents={settingsTemplate}
                        toolSettings={toolSettings}
                        setToolSetting={setToolSetting}
                    />
                    <ColorPickerWidget 
                        primaryColor={primaryColor} 
                        secondaryColor={secondaryColor}
                        setColorState={setColorstate}
                        setColor={setColor}
                        colorState={colorState}
                    />
                    <BrushSizeWidget/>
                </Resizable>
        </aside>
    )
}