import React, { useState, useEffect, MouseEventHandler, RefObject } from 'react';

interface InputDialogProps {
    newTextTitleInputRef: RefObject<HTMLInputElement>;
    clickHandlerOne: MouseEventHandler;
    clickHandlerTwo: MouseEventHandler;
}

const InputDialog: React.FC<InputDialogProps> = ({ newTextTitleInputRef, clickHandlerOne, clickHandlerTwo }: InputDialogProps) => {
    const [titleInput, setTitleInput] = useState("");

    useEffect(() => {
        if (newTextTitleInputRef.current) newTextTitleInputRef.current.focus();
    }, []);

    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <input
                    ref={newTextTitleInputRef}
                    className="dialog-input"
                    type="text"
                    placeholder="Type title here..."
                    value={titleInput}
                    onChange={((event) => setTitleInput(event.target.value))}
                />
                <button
                    className="dialog-button button-2"
                    onClick={clickHandlerOne}
                    disabled={titleInput === "" ? true : false}>
                    Save
                </button>
                <button
                    className="dialog-button button-3"
                    onClick={clickHandlerTwo}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default InputDialog;
