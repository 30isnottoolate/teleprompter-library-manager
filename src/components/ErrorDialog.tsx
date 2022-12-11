import React, { MouseEventHandler } from 'react';

interface ErrorDialogProps {
    clickHandler: MouseEventHandler
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ clickHandler }: ErrorDialogProps) => {
    return (
        <div className="dialog-screen">
            <div className="dialog-box">
                <p className="dialog-text">Warning! This file is invalid or corrupted.</p>
                <button className="dialog-button button-3" onClick={clickHandler}>Okay</button>
            </div>
        </div>
    );
}

export default ErrorDialog;
