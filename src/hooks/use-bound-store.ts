import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSceneSlice, type SceneSlice } from '../features/camera/slices/scene.slice';
import { createToolSlice, type ToolSlice } from '../features/tools/slices/tools.slice';
import { type CameraSlice, createCameraSlice } from '../features/camera/slices/camera.slice';
import { ColorSlice, createColorSlice } from '../features/color/slices/color.slice';

export type BoundStore = ToolSlice & SceneSlice & CameraSlice & ColorSlice;

const useBoundStore = create<BoundStore, [
    ['zustand/devtools', never],
    ['zustand/persist', BoundStore],
]>(devtools(persist((...a) => ({
        ...createToolSlice(...a),
        ...createSceneSlice(...a),
        ...createCameraSlice(...a),
        ...createColorSlice(...a)
    }),
    {
        name: 'inkly-paint',
    }))
)



export default useBoundStore;