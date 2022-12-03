import React, { MouseEventHandler } from 'react';

interface InputDialogProps {
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler
}

const DeletionDialog: React.FC<InputDialogProps> = ({ clickHandlerOne, clickHandlerTwo }: InputDialogProps) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <p className="dialog-question">Are you sure you want to delete this text?</p>
                <button className="dialog-button button-2" onClick={clickHandlerOne}>Yes</button>
                <button className="dialog-button button-3" onClick={clickHandlerTwo}>No</button>
            </div>
        </div>
    );
}

export default DeletionDialog;
