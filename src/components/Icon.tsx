import React, { MouseEventHandler } from 'react';
import icons from '../utilities/icons';

interface IconProps {
    icon: string;
    width?: number;
    height: number;
    viewBox?: string;
    disabled?: boolean;
    clickHandler: MouseEventHandler;
    tooltipText: string;
    tooltipCentered: boolean;
}

const Icon: React.FC<IconProps> = ({
    icon, viewBox, disabled, clickHandler, tooltipText }) => {

    return (
        <button className="icon"
            title={tooltipText}
            disabled={disabled}
            onClick={clickHandler} >
            <svg viewBox={viewBox ? viewBox : "0 0 16 16"} >
                {icons[icon]}
            </svg>
        </button>
    );
}

export default Icon;
