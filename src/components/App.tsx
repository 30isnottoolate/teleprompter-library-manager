import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

const App: React.FC = () => {
    const [inputText, setInputText] = useState("");

    return (
        <>
            <div id="text-select-container">
                <select id="texts" name="texts" size={3}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div id="text-input-container">
                <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} />
            </div>
            <div id="text-display-container" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(inputText)}} />
        </>
    )
}

export default App;
