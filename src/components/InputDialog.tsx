import React, { RefObject } from 'react';

interface InputDialogProps {
    textTitleRef: RefObject<HTMLInputElement>, 
    clickHandlerOne: MouseEvent, 
    clickHandlerTwo: MouseEvent
}

const InputDialog: React.FC<InputDialogProps> = ({textTitleRef, clickHandlerOne, clickHandlerTwo}: InputDialogProps) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <input
                    ref={textTitleRef}
                    type="text"
                    placeholder="Type title here..."
                />
                <button className="dialog-button button-2" onClick={() => clickHandlerOne}>Save</button>
                <button className="dialog-button button-3" onClick={() => clickHandlerTwo}>Cancel</button>
            </div>
        </div>
    );
}

export default InputDialog;