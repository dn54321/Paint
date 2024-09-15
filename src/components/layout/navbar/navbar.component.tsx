import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@components/ui/menubar";
import React, { useState } from "react";
import { CreateSceneDialog } from "../../../features/surface/components/dialog/create-surface-dialog/create-surface-dialog.component";
import { Dimension } from "../../../types/geometry.types";


export interface SceneSettings {
    scaleZoomDimension?: Dimension,
}

export interface NavbarProps {
    surfaceCreationSettings?: Partial<SceneSettings>
}

export default function Navbar(props: NavbarProps) {
    const [isCreateCanvasDialogOpen, setCreateCanvasDialogOpen] = useState(false);
    return (
        <React.Fragment>
        <Menubar className="border-l-0 border-r-0 border-t-0 h-fit z-10 bg-muted/10">
            <div className="flex items-center">
                <img src="./drawt-light.svg" alt="logo" className="w-7 h-7 mx-3"/>
                <div className="flex flex-col">
                    <div className="flex">
                        <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent className="w-64">
                            <MenubarItem onClick={() => setCreateCanvasDialogOpen(true)}>
                                New surface 
                                <MenubarShortcut>Ctrl+N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem>
                            Import surface <MenubarShortcut>Ctrl+Alt+N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                            <MenubarSubTrigger>Export surface</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Portable Network Graphics (.png)</MenubarItem>
                                <MenubarItem>Joint Photographic Experts Group (.jpeg)</MenubarItem>
                                <MenubarItem>Portable Document Format (.pdf)</MenubarItem>
                            </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem>
                            Print... <MenubarShortcut>⌘P</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                        <MenubarTrigger>Edit</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem>
                            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                            <MenubarSubTrigger>Find</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Search the web</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Find...</MenubarItem>
                                <MenubarItem>Find Next</MenubarItem>
                                <MenubarItem>Find Previous</MenubarItem>
                            </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem>Cut</MenubarItem>
                            <MenubarItem>Copy</MenubarItem>
                            <MenubarItem>Paste</MenubarItem>
                        </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                        <MenubarTrigger>View</MenubarTrigger>
                        <MenubarContent>
                            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
                            <MenubarCheckboxItem checked>
                            Always Show Full URLs
                            </MenubarCheckboxItem>
                            <MenubarSeparator />
                            <MenubarItem inset>
                            Reload <MenubarShortcut>⌘R</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem disabled inset>
                            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Hide Sidebar</MenubarItem>
                        </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                        <MenubarTrigger>Profiles</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value="benoit">
                            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                            </MenubarRadioGroup>
                            <MenubarSeparator />
                            <MenubarItem inset>Edit...</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Add Profile...</MenubarItem>
                        </MenubarContent>
                        </MenubarMenu>
                    </div>
                </div>
            </div>
            </Menubar>
            <CreateSceneDialog 
                open={isCreateCanvasDialogOpen} 
                onOpenChange={setCreateCanvasDialogOpen}
                scaleZoomDimension={props.surfaceCreationSettings?.scaleZoomDimension}
            />
        </React.Fragment>

    )
}