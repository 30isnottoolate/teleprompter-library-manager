import React, { MouseEventHandler } from 'react';

interface DialogProps {
    textOne: string,
    textTwo: string,
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler,
    clickHandlerThree: MouseEventHandler
}

const Dialog: React.FC<DialogProps> = ({ textOne, textTwo, clickHandlerOne, clickHandlerTwo, clickHandlerThree }) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <p className="dialog-question">{textOne}<br />{textTwo}</p>
                <button className="dialog-button button-1" onClick={clickHandlerOne}>Save</button>
                <button className="dialog-button button-2" onClick={clickHandlerTwo}>Discard</button>
                <button className="dialog-button button-3" onClick={clickHandlerThree}>Cancel</button>
            </div>
        </div>
    );
}

export default Dialog;
