import React, { forwardRef, useImperativeHandle, useRef } from "react"

export interface HueRingPointerProps {
    width: number, // decimal 0-1 (Percentage)
    height: number // decimal 0-1 (Percentage)
    style?: React.CSSProperties
}

const HueRingPointer = forwardRef(function HueRingPointer(
    props: HueRingPointerProps, 
    ref: React.ForwardedRef<SVGSVGElement | undefined>
) {
    const innerRef = useRef<SVGSVGElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);
    
    return (
        <React.Fragment>
            <svg                 
                width={`${props.width*100}%`} 
                height={`${props.height*100}%`} 
                className="absolute"
                viewBox="0 0 100 100" 
            >
                <defs>
                    <mask id="rect-hole">
                        <rect width="100%" height="100%" fill="white" />
                        <rect width="30" height="70" x="35" y="15" fill="black" />
                    </mask>
                </defs>
            </svg>
            <svg 
                ref={innerRef} 
                className={`absolute pointer-events-none`} 
                width={`${props.width*100}%`} 
                height={`${props.height*100}%`}
                viewBox="0 0 100 100" 
                style={{
                    left:`${100*(0.5 - props.width/2)}%`, 
                    top:`${100*(0.5 - props.height/2)}%`,
                    ...props.style
                }}
            >
                <rect width="60" height="100" fill="black" x="20" mask="url(#rect-hole)"/>
                <rect width="50" height="90" x="25" y="5" fill="white" mask="url(#rect-hole)"/>
            </svg>
        </React.Fragment>
    )
})

export default HueRingPointer;