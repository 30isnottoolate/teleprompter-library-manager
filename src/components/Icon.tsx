import React, { MouseEventHandler } from 'react';
import icons from '../utilities/icons';

const Icon: React.FC<{ icon: string, size: number, clickHandler: MouseEventHandler }> = ({ icon, size, clickHandler }) => {

    return (
        <button
            onClick={clickHandler} style={{backgroundColor: "#353535", width: size, height: size, borderWidth: "0"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="#bfbfbf" viewBox="0 0 16 16">
                {icons[icon]}
            </svg>
        </button>
    )
}

export default Icon;
