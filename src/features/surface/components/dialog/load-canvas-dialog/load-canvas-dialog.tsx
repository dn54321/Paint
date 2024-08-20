
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../../../../components/ui/alert-dialog";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { CreateSceneForm } from "../../forms/create-canvas-form/create-canvas-form.component";

export interface CreateSceneFormSubmit {
    width: number,
    height: number,
    name: string
}

export interface CreateSceneDialogProps {
    setDialogOpen: (openState: boolean) => void;
}

export function ImportSceneWizard() {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Scene</Label>
            <Input id="picture" type="file" />
        </div>
    )
}

export interface LoadSceneDialogProps {
    onOpenChange?: (isOpen: boolean) => void,
    open?: boolean,
}


export function LoadSceneDialog(props: LoadSceneDialogProps) {
    const [tabValue, changeTabValue] = useState('create-scene');
    const [loadSceneDialogOpen, setLoadSceneDialogOpen] = useState(false);
    return (
        <AlertDialog
            open={props.open || loadSceneDialogOpen} 
            onOpenChange={props.onOpenChange || setLoadSceneDialogOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Load Scene</AlertDialogTitle>
                    <AlertDialogDescription>Create or import a scene before continuing.</AlertDialogDescription>
                    <Tabs value={tabValue} onValueChange={changeTabValue} className="w-[400px]">
                        <TabsList className="mb-5">
                            <TabsTrigger value="create-scene">Create Scene</TabsTrigger>
                            <TabsTrigger value="import-scene">Import Scene</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create-scene">
                            <CreateSceneForm 
                                onPostSubmit={() => setLoadSceneDialogOpen(false)}
                            />
                        </TabsContent>
                        <TabsContent value="import-scene">
                            <ImportSceneWizard/>
                        </TabsContent>
                    </Tabs>
                </AlertDialogHeader>
            </AlertDialogContent>
      </AlertDialog>
    )
}