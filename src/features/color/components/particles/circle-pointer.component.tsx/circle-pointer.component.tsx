import React, { forwardRef, useImperativeHandle, useRef } from "react"

export interface CirclePointerProps {
    radius: number, // decimal 0-1 (Percentage),
    style?: React.CSSProperties
}

const CirclePointer = forwardRef(function CirclePointer(
    props: CirclePointerProps, 
    ref: React.ForwardedRef<SVGSVGElement | undefined>
) {
    const innerRef = useRef<SVGSVGElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);
    
    return (
        <React.Fragment>
            <svg                 
                width={`${props.radius*100}%`} 
                height={`${props.radius*100}%`} 
                className="absolute"
                viewBox="0 0 100 100" 
            >
                <defs>
                    <mask id="circle-hole">
                        <rect width="100%" height="100%" fill="white" />
                        <circle r="32%" cx="50%" cy="50%" fill="black" />
                    </mask>
                </defs>
            </svg>
            <svg 
                ref={innerRef} 
                className={`absolute pointer-events-none top-0 left-0`} 
                width={`${props.radius*100}%`} 
                height={`${props.radius*100}%`}
                style={{...props.style}}
                viewBox="0 0 100 100" 
            >
                <circle cx="50%" cy="50%" r="50%" fill="black" mask="url(#circle-hole)"/>
                <circle cx="50%" cy="50%" r="45%" fill="white" mask="url(#circle-hole)"/>
            </svg>
        </React.Fragment>
    )
})

export default CirclePointer;