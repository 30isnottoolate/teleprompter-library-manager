import React from 'react';
import DOMPurify from 'dompurify';

const Output: React.FC<{ output: string }> = ({ output }) => {
    return (
        <div id="output">
            <div className="mini-toolbar"></div>
            <p className="section-label">OUTPUT</p>
            <div
                id="text-display"
                className="scrollbar"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(output) }}
            />
        </div>
    );
}

export default Output;
