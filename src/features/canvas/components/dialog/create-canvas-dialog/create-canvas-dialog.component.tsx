
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../../../../components/ui/alert-dialog";
import { CreateCanvasForm } from "../../forms/create-canvas-form/create-canvas-form.component";
import { DialogProps } from "@radix-ui/react-dialog";

export interface CreateCanvasFormSubmit {
    width: number,
    height: number,
    name: string
}

export function CreateCanvasDialog(props: DialogProps) {
    const [createCanvasDialogOpen, setCreateCanvasDialogOpen] = useState(false);
    return (
        <AlertDialog 
            open={ props.open || createCanvasDialogOpen } 
            onOpenChange={ props.onOpenChange || setCreateCanvasDialogOpen }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create Canvas</AlertDialogTitle>
                    <AlertDialogDescription>Please provide the name and dimensions of your canvas to continue.</AlertDialogDescription>
                    <CreateCanvasForm 
                        onPostSubmit={() => props.onOpenChange ? props.onOpenChange(false) : setCreateCanvasDialogOpen(false)}
                    />
                </AlertDialogHeader>
            </AlertDialogContent>
      </AlertDialog>
    )
}