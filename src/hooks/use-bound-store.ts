import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ColorSlice, createColorSlice } from '../features/color/slices/color.slice';
import { type CameraSlice, createCameraSlice } from '../features/display/slices/camera.slice';
import { createSceneSlice, type SceneSlice } from '../features/display/slices/scene.slice';
import { createToolSlice, type ToolSlice } from '../features/tools/slices/tools.slice';

export type BoundStore = ToolSlice & SceneSlice & CameraSlice & ColorSlice;

const useBoundStore = create<BoundStore, [
    ['zustand/devtools', never],
    ['zustand/persist', BoundStore],
]>(devtools(persist((...a) => ({
        ...createToolSlice(...a),
        ...createSceneSlice(...a),
        ...createCameraSlice(...a),
        ...createColorSlice(...a),
    }),
    {
        name: 'inkly-paint',
    }))
)



export default useBoundStore;