import React, { useRef, MouseEventHandler } from 'react';
import icons from '../utilities/icons';

interface IconProps {
    icon: string,
    width?: number,
    height: number,
    viewBox?: string,
    disabled?: boolean,
    clickHandler: MouseEventHandler,
    tooltipText: string,
    tooltipCentered: boolean
}

const Icon: React.FC<IconProps> = ({
    icon, width, height, viewBox, disabled, clickHandler, tooltipText, tooltipCentered }) => {

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

    const tooltipTranslateX = () => {
        return tooltipCentered ? width ? `calc(-50% + ${width / 2}px)` : `calc(-50% + ${height / 2}px)` : `0px`;
    }

    const arrowTranslateX = () => width ? (width - 10) / 2 : (height - 10) / 2;

    return (
        <div className="icon-container">
            <button className="icon"
                disabled={disabled}
                onClick={clickHandler}
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
                    viewBox={viewBox ? viewBox : "0 0 16 16"}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave} >
                    {icons[icon]}
                </svg>
            </button>
            <p
                ref={tooltipRef}
                className="icon-tooltip"
                style={{
                    position: "absolute",
                    transform: `translateX(${tooltipTranslateX()}) translateY(10px)`
                }}>
                {tooltipText}
            </p>
            <svg
                ref={tooltipArrowRef}
                className="icon-tooltip-arrow"
                width="10" height="10"
                style={{
                    display: "block",
                    position: "absolute",
                    transform: `translateX(${arrowTranslateX()}px) translateY(5px)`
                }}>
                <polygon points="5,0 10,5 0,5" />
            </svg>
        </div>
    );
}

export default Icon;
