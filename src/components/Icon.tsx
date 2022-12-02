import React, { MouseEventHandler } from 'react';
import icons from '../utilities/icons';

const Icon: React.FC<{ icon: string, size: number, viewBox?: string, clickHandler: MouseEventHandler }> = ({ icon, size, viewBox, clickHandler }) => {

    return (
        <button className="icon"
            onClick={clickHandler} style={{backgroundColor: "#353535", height: size, borderWidth: "0"}}>
            <svg xmlns="http://www.w3.org/2000/svg" height={size} fill="#bfbfbf" viewBox={viewBox ? viewBox : "0 0 16 16"}>
                {icons[icon]}
            </svg>
        </button>
    )
}

export default Icon;
