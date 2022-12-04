import React, { useRef, MouseEventHandler } from 'react';
import icons from '../utilities/icons';

interface IconProps {
    icon: string,
    tooltipText: string,
    width?: number,
    height: number,
    disabled?: boolean,
    viewBox?: string,
    clickHandler: MouseEventHandler
}

const Icon: React.FC<IconProps> = ({ icon, tooltipText, width, height, disabled, viewBox, clickHandler }) => {
    const tooltipRef = useRef<HTMLParagraphElement>(null);

    return (
        <div className="icon-container">
            <button className="icon"
                onClick={clickHandler}
                disabled={disabled}
                style={{
                    backgroundColor: "#353535",
                    width: width ? width : height,
                    height: height,
                    borderWidth: "0"
                }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={width ? width : height}
                    height={height}
                    fill="#bfbfbf"
                    viewBox={viewBox ? viewBox : "0 0 16 16"}
                    onMouseEnter={() => { if (tooltipRef.current) tooltipRef.current.style.opacity = "1" }}
                    onMouseLeave={() => { if (tooltipRef.current) tooltipRef.current.style.opacity = "0" }} >
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
