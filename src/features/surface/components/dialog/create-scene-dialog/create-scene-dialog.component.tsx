
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../../../../components/ui/alert-dialog";

import { DialogProps } from "@radix-ui/react-dialog";
import { CreateSceneForm } from "../../forms/create-canvas-form/create-canvas-form.component";

export interface CreateSceneFormSubmit {
    width: number,
    height: number,
    name: string
}

export function CreateSceneDialog(props: DialogProps) {
    const [createSceneDialogOpen, setCreateSceneDialogOpen] = useState(false);
    return (
        <AlertDialog 
            open={ props.open || createSceneDialogOpen } 
            onOpenChange={ props.onOpenChange || setCreateSceneDialogOpen }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create Illustration</AlertDialogTitle>
                    <AlertDialogDescription>Please provide the name and dimensions of your Illustration to continue.</AlertDialogDescription>
                    <CreateSceneForm 
                        onPostSubmit={() => props.onOpenChange ? props.onOpenChange(false) : setCreateSceneDialogOpen(false)}
                    />
                </AlertDialogHeader>
            </AlertDialogContent>
      </AlertDialog>
    )
}