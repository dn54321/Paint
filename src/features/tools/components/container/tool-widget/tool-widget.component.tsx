import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion";
import { cn } from "../../../../../utils/utils";

export interface ToolWidget {
    title: string,
    icon?: React.ReactNode,
    children?: React.ReactNode,
    className?: string
}

export function ToolWidget(props: ToolWidget) {
    return (
        <Accordion 
            type="single" 
            collapsible 
            className={cn("w-full", props.className)}
            defaultValue="true"
        >
            <AccordionItem value="true">
                <AccordionTrigger className="h6 ml-3 mr-2">
                    <div className="flex gap-3">
                        {props.icon}
                        <h1>{props.title}</h1>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {props.children}
                </AccordionContent>
            </AccordionItem>
        </Accordion> 
    )
}
