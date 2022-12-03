import React, { MouseEventHandler } from 'react';

interface NewOpenDialogProps {
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler,
    clickHandlerThree: MouseEventHandler,
    message: string
}

const NewOpenDialog: React.FC<NewOpenDialogProps> = ({ clickHandlerOne, clickHandlerTwo, clickHandlerThree, message }: NewOpenDialogProps) => {
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
