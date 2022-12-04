import React, { useRef, MouseEventHandler } from 'react';
import icons from '../utilities/icons';

interface IconProps {
    icon: string,
    tooltipText: string,
    size: number,
    disabled?: boolean,
    viewBox?: string,
    clickHandler: MouseEventHandler
}

const Icon: React.FC<IconProps> = ({ icon, tooltipText, size, disabled, viewBox, clickHandler }) => {
    const tooltipRef = useRef<HTMLParagraphElement>(null);

    return (
        <div className="icon-container">
            <button className="icon"
                onClick={clickHandler} disabled={disabled} style={{ backgroundColor: "#353535", height: size, borderWidth: "0" }}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height={size} 
                    fill="#bfbfbf" 
                    viewBox={viewBox ? viewBox : "0 0 16 16"}
                    onMouseEnter={() => {if (tooltipRef.current) tooltipRef.current.style.opacity = "1"}}
                    onMouseLeave={() => {if (tooltipRef.current) tooltipRef.current.style.opacity = "0"}} >
                    {icons[icon]}
                </svg>
            </button>
            <p
                ref={tooltipRef}
                className="icon-tooltip"
            >
                {tooltipText}
            </p>
        </div>
    );
}

export default Icon;
