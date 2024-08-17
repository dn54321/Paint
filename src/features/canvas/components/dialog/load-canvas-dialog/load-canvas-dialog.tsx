
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../../../../components/ui/alert-dialog";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { CreateCanvasForm } from "../../forms/create-canvas-form/create-canvas-form.component";

export interface CreateCanvasFormSubmit {
    width: number,
    height: number,
    name: string
}

export interface CreateCanvasDialogProps {
    setDialogOpen: (openState: boolean) => void;
}

export function ImportCanvasWizard() {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Canvas</Label>
            <Input id="picture" type="file" />
        </div>
    )
}

export interface LoadCanvasDialogProps {
    onOpenChange?: (isOpen: boolean) => void,
    open?: boolean,
}


export function LoadCanvasDialog(props: LoadCanvasDialogProps) {
    const [tabValue, changeTabValue] = useState('create-canvas');
    const [loadCanvasDialogOpen, setLoadCanvasDialogOpen] = useState(false);
    return (
        <AlertDialog
            open={props.open || loadCanvasDialogOpen} 
            onOpenChange={props.onOpenChange || setLoadCanvasDialogOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Load Canvas</AlertDialogTitle>
                    <AlertDialogDescription>Create or import a canvas before continuing.</AlertDialogDescription>
                    <Tabs value={tabValue} onValueChange={changeTabValue} className="w-[400px]">
                        <TabsList className="mb-5">
                            <TabsTrigger value="create-canvas">Create Canvas</TabsTrigger>
                            <TabsTrigger value="import-canvas">Import Canvas</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create-canvas">
                            <CreateCanvasForm 
                                onPostSubmit={() => setLoadCanvasDialogOpen(false)}
                            />
                        </TabsContent>
                        <TabsContent value="import-canvas">
                            <ImportCanvasWizard/>
                        </TabsContent>
                    </Tabs>
                </AlertDialogHeader>
            </AlertDialogContent>
      </AlertDialog>
    )
}