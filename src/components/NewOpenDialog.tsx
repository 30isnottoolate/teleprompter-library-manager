import React, { MouseEventHandler, ReactNode } from 'react';

interface NewOpenDialogProps {
    message: ReactNode,
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler,
    clickHandlerThree: MouseEventHandler
}

const NewOpenDialog: React.FC<NewOpenDialogProps> = ({ message, clickHandlerOne, clickHandlerTwo, clickHandlerThree }: NewOpenDialogProps) => {
    return (
        <div className="dialog-screen">
                    <div className="dialog-box">
                        <p className="dialog-question">{message}</p>
                        <button className="dialog-button button-1" onClick={clickHandlerOne}>Save</button>
                        <button className="dialog-button button-2" onClick={clickHandlerTwo}>Discard</button>
                        <button className="dialog-button button-3" onClick={clickHandlerThree}>Cancel</button>
                    </div>
                </div>
    );
}

export default NewOpenDialog;
