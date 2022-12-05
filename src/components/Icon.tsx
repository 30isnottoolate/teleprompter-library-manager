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
    const tooltipArrowRef = useRef<SVGSVGElement>(null);

    const handleOnMouseEnter = () => {
        if (tooltipRef.current) tooltipRef.current.style.opacity = "1";
        if (tooltipArrowRef.current) tooltipArrowRef.current.style.opacity = "1";
    }

    const handleOnMouseLeave = () => {
        if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
        if (tooltipArrowRef.current) tooltipArrowRef.current.style.opacity = "0";
    }

    const getArrowTransformValue = () => {
        if (width) {
            return `translateX(${(width - 10) / 2}px) translateY(5px)`;
        } else
            return `translateX(${(height - 10) / 2}px) translateY(5px)`;
    }

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
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave} >
                    {icons[icon]}
                </svg>
            </button>
            <p
                ref={tooltipRef}
                className="icon-tooltip">
                {tooltipText}
            </p>
            <svg
                ref={tooltipArrowRef}
                className="icon-tooltip-arrow"
                width="10" height="10"
                style={{
                    display: "block",
                    position: "absolute",
                    transform: getArrowTransformValue()
                }}>
                <polygon points="5,0 10,5 0,5" />
            </svg>
        </div>
    );
}

export default Icon;
