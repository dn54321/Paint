import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../../../../../components/ui/toggle-group";

export interface SurfaceFile {
    name: string,
    key: string,
}

export interface FilebarProps {
    files: Array<SurfaceFile>,
    active?: SurfaceFile,
    onClick?: (file: SurfaceFile) => void,
    onClose?: (file: SurfaceFile) => void,
    onMove?: (file: SurfaceFile, position: number) => void,
}

export type FileProps = {
    file: SurfaceFile 
    onClick?: (file: SurfaceFile) => void,
    onClose?: (file: SurfaceFile) => void,
};

export function FileItem(props: FileProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({id: props.file.key});
    const style = transform ? {
        transform: CSS.Transform.toString(transform),
        cursor: "grabbing",
        transition,
    }: undefined;

    return (
        <div className="flex border-r hover:z-20 hover:bg-muted" 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}>
            <ToggleGroupItem 
                value={props.file.key} 
                className="
                    flex px-2 justify-between items-center peer rounded-none
                    transition-none data-[state=on]:bg-accent [&>p]:data-[state=on]:font-medium 
                    cursor-pointer text-muted-foreground hover:text-current"
            >
                <p className="small font-normal w-32 overflow-hidden">{props.file.name}</p>
            </ToggleGroupItem>
            <Button 
                variant="ghost" 
                className="w-fit p-1 peer-data-[state=on]:bg-accent     rounded-none -mx-1"
                onClick={() =>  props.onClose && props.onClose(props.file)}
            ><X size={16}/></Button>
        </div>
    )
}

export function Filebar(props: FilebarProps) {
    const draggableItems = props.files.map(file => file.key)
    const fileMap = props.files.reduce<Record<string, SurfaceFile>>(
        (hashmap, file) => Object.assign(hashmap, {[file.key]: file})
    , {});
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (over === null) {
            return;
        }
        if (props.onMove) {
            props.onMove(fileMap[active.id], draggableItems.indexOf(over.id as string))
        }

    }

    return (
        <DndContext 
            collisionDetection={closestCenter} 
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        >

                <SortableContext 
                    items={draggableItems}
                    strategy={horizontalListSortingStrategy}
                >
                    <ToggleGroup 
                        type="single" 
                        className="w-full border-t h-10 flex justify-start gap-0"
                        value={props.active?.key}
                        onValueChange={(key) => props.onClick && props.onClick(fileMap[key])}
                    >   
                        {props.files.map(file => (
                            <FileItem 
                                file={file} 
                                key={file.key}
                                onClick={props.onClick} 
                                onClose={props.onClose}
                            />
                        ))}
                    </ToggleGroup>
                </SortableContext>

        </DndContext>
    )
}