import React, { useEffect, MouseEventHandler, RefObject } from 'react';

interface InputDialogProps {
    newTextTitleInputRef: RefObject<HTMLInputElement>,
    clickHandlerOne: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler
}

const InputDialog: React.FC<InputDialogProps> = ({ newTextTitleInputRef, clickHandlerOne, clickHandlerTwo }: InputDialogProps) => {
    useEffect(() => {
        if (newTextTitleInputRef.current) newTextTitleInputRef.current.focus()
    }, []);

    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <input
                    ref={newTextTitleInputRef}
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
