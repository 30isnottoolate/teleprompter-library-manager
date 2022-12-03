import React, { MouseEventHandler, RefObject } from 'react';

interface InputDialogProps {
    textTitleInputRef: RefObject<HTMLInputElement>, 
    clickHandlerOne: MouseEventHandler, 
    clickHandlerTwo: MouseEventHandler
}

const InputDialog: React.FC<InputDialogProps> = ({textTitleInputRef, clickHandlerOne, clickHandlerTwo}: InputDialogProps) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <input
                    ref={textTitleInputRef}
                    type="text"
                    placeholder="Type title here..."
                />
                <button className="dialog-button button-2" onClick={clickHandlerOne}>Save</button>
                <button className="dialog-button button-3" onClick={clickHandlerTwo}>Cancel</button>
            </div>
        </div>
    );
}

export default InputDialog;
