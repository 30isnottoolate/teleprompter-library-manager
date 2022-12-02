import React from 'react';
import icons from '../utilities/icons';

const Icon: React.FC<{ icon: string, clickHandler: Function }> = ({ icon, clickHandler }) => {

    return (
        <button
            onClick={() => clickHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                {icons[icon]}
            </svg>
        </button>
    )
}

export default Icon;
