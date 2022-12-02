import React, { MouseEventHandler } from 'react';

interface DialogProps {
    dialogType: string, //new, open, input, delete
    textOne: string,
    textTwo: string,
    clickHandlerOne?: MouseEventHandler,
    clickHandlerTwo: MouseEventHandler,
    clickHandlerThree: MouseEventHandler
}

const Dialog: React.FC<DialogProps> = ({ dialogType, textOne, textTwo, clickHandlerOne, clickHandlerTwo, clickHandlerThree }) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <p className="dialog-question">
                    {(dialogType === "new" || dialogType === "open") ? "Warning! This library was modified." :
                        dialogType === "input" ? "" : "Are you sure you want to delete this text?"}
                    <br />
                    {dialogType === "new" ? "Do you want to save it before creating a new one?" : 
                    dialogType === "open" ? "Do you want to save it before opening another one?" :
                        dialogType === "input" ? "" : ""}
                </p>
                {(dialogType === "new" || dialogType === "open") &&
                    <button className="dialog-button button-1" onClick={clickHandlerOne}>Save</button>
                }
                <button
                    className="dialog-button button-2"
                    onClick={clickHandlerTwo}>
                    {(dialogType === "new" || dialogType === "open") ? "Discard" :
                        dialogType === "input" ? "Save" : "Yes"}
                </button>
                <button
                    className="dialog-button button-3"
                    onClick={clickHandlerThree}>
                    {(dialogType === "new" || dialogType === "open") ? "Cancel" :
                        dialogType === "input" ? "Cancel" : "No"}
                </button>
            </div>
        </div>
    );
}

export default Dialog;
