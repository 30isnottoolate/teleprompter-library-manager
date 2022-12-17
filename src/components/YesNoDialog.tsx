import React, { MouseEventHandler } from 'react';

interface YesNoDialogProps {
    text: string,
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler
}

const YesNoDialog: React.FC<YesNoDialogProps> = ({ text, clickHandlerOne, clickHandlerTwo }: YesNoDialogProps) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <p className="dialog-text">{text}</p>
                <button className="dialog-button button-2" onClick={clickHandlerOne}>Yes</button>
                <button className="dialog-button button-3" onClick={clickHandlerTwo}>No</button>
            </div>
        </div>
    );
}

export default YesNoDialog;
