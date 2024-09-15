import React from "react";
import { Scene } from "../entities/scene.entity";
import { Position } from "../../../types/geometry.types";

export enum DisplayActions {
    ON_CLICK = "onClick",
    ON_MOUSE_DOWN= "onMouseDown",
    ON_MOUSE_UP = "onMouseUp",
    ON_MOUSE_MOVE = "onMouseMove",
    ON_MOUSE_EXIT = "onMouseLeave",
    ON_MOUSE_ENTER = "onMouseEnter",
    ON_SCROLL = "onScroll",
}

export type DisplayActionEventMap = {
    [DisplayActions.ON_CLICK]: MouseDisplayActionPayload,
    [DisplayActions.ON_MOUSE_DOWN]: MouseDisplayActionPayload,
    [DisplayActions.ON_MOUSE_UP]: MouseDisplayActionPayload,
    [DisplayActions.ON_MOUSE_MOVE]: MouseDisplayActionPayload,
    [DisplayActions.ON_MOUSE_EXIT]: MouseDisplayActionPayload,
    [DisplayActions.ON_MOUSE_ENTER]: MouseDisplayActionPayload,
    [DisplayActions.ON_SCROLL]: ScrollDisplayActionPayload,
}

export type DisplayEvents = MouseDisplayActionPayload | ScrollDisplayActionPayload;
export type DisplayEventActionFn<T = DisplayEvents> = (payload: T) => void

export interface MouseDisplayActionPayload extends GenericActionPayload {
    displayMousePos: Position,
    boardMousePos: Position,
    surfaceMousePos: Position,
    event: MouseEvent,
}

export interface ScrollDisplayActionPayload extends GenericActionPayload {
    event: React.UIEvent<HTMLDivElement, UIEvent>,
}

export interface GenericActionPayload {
    cursorRef: React.RefObject<HTMLCanvasElement>,
    viewportRef: React.RefObject<HTMLDivElement>,
    boardRef: React.RefObject<HTMLCanvasElement>,
    scene: Scene,
}

