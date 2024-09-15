import useBoundStore from "../../../hooks/use-bound-store";
import { CameraActionSubscriber } from "../../display/services/camera/camera-action-subscriber.service";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { useBrushTool } from "./use-brush-tool.hook";
import { useHandTool } from "./use-hand-tool.hook";
import { useMagnifyTool } from "./use-magnify-tool.hook";
export function useTool() {
    const toolName = useBoundStore(state => state.activeTool);
    const setActiveTool = useBoundStore(state => state.setActiveTool);
    const setToolSetting = useBoundStore(state => state.setToolSetting);
    const magnifyTool = useMagnifyTool(); 
    const toolMap = {
        [Tools.MAGNIFY]:  useMagnifyTool(),
        [Tools.HAND]: useHandTool(),
        [Tools.BRUSH]: useBrushTool(),
    } as Record<Tools, ToolHookResponse>

    const activeTool = toolName in toolMap ? toolMap[toolName as keyof typeof toolMap] : magnifyTool;
    const toolSettings = useBoundStore(state => state[activeTool.name + "State"].settings)
    
    const withToolActions = (actionSubscriber?: CameraActionSubscriber) => {
        if (!actionSubscriber) {
            return;
        }

        // unset all tool actions
        for (const tool of Object.values(toolMap)) {
            for (const eventAction of tool.actions) {
                actionSubscriber.subscribe(eventAction.eventName, eventAction.actionName, () => {});
            }
        }

        // set active tool actions
        for (const eventAction of activeTool.actions) {
            actionSubscriber.subscribe(eventAction.eventName, eventAction.actionName, eventAction.action);
        }
    }

    return {
        activeTool, 
        toolPointer: activeTool.toolPointer,
        settingsTemplate: activeTool.settingsTemplate ?? [],
        setActiveTool, 
        setToolSetting,
        toolSettings,
        withToolActions
    };
}