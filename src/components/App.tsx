import React, { useState } from 'react';
import './App.css';
import Editor from './Editor';

const App: React.FC = () => {
    const [inputText, setInputText] = useState("");

    return (
        <>
            <div id="start-menu">
                <h1>Library Manager</h1>
                <h2>for KV Teleprompter</h2>
                <div id="start-buttons">
                    <button className="start-button">New</button>
                    <button className="start-button">Open</button>
                </div>
            </div>
        </>
    )
}

export default App;
