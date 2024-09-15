import { HsvaColor, HsvColor } from "colord";
import useBoundStore from "../../../hooks/use-bound-store";
import { ColorState } from "../types/color.type";

export function useColor() {
    const primaryColor = useBoundStore(state => state.primaryColor);
    const secondaryColor = useBoundStore(state => state.secondaryColor);
    const defaultColorState = useBoundStore(state => state.colorState);
    const setColorstate =  useBoundStore(state => state.setColorState);
    const defaultColor = (defaultColorState === ColorState.PRIMARY) ? primaryColor : secondaryColor;
    const setColor = useBoundStore(state => state.setColor);

    function setColorSmart(color: HsvaColor | HsvColor, colorState?: ColorState) {
        setColor({...defaultColor, ...color}, colorState ?? defaultColorState);
    }
    
    return {
        color: defaultColor,
        setColor: setColorSmart,
        setColorstate: setColorstate,
        primaryColor,
        secondaryColor,
        colorState: defaultColorState,
    }
}