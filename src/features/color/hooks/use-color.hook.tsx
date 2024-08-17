import useBoundStore from "../../../hooks/use-bound-store";

export function useColor() {
    const color = useBoundStore(state => state.color);
    const setColor = useBoundStore(state => state.setColor);
    return {
        color: color,
        setColor: setColor
    }
}