import React, { useState, useRef } from 'react';
import './App.css';
import Editor from './Editor';

const App: React.FC = () => {
    const [mode, setMode] = useState("start"); // start, new, open
    const [loadedData, setLoadedData] = useState("");
    const openRef = useRef<HTMLInputElement>(null);

    const triggerClick = () => {
        if (openRef.current) openRef.current.click();
    }

    function handleFileOpening(event) {
        let reader = new FileReader();
        reader.onload = onFileLoading;
        reader.readAsText(event.target.files[0]);
    }

    function onFileLoading(event) {
        console.log(event.target.result);
        let jsonData = JSON.parse(event.target.result);
    }

    if (mode === "start") {
        return (
            <>
                <div id="start-menu">
                    <h1>Library Manager</h1>
                    <h2>for KV Teleprompter</h2>
                    <div id="start-buttons">
                        <button
                            className="start-button"
                            onClick={() => { }}
                        >
                            New
                        </button>
                        <input
                            id="myFile"
                            ref={openRef}
                            onChange={handleFileOpening}
                            accept=".json"
                            style={{ display: "none" }}
                            type="file"
                            name="filename" />
                        <button
                            className="start-button"
                            onClick={triggerClick}
                        >
                            Open
                        </button>
                    </div>
                </div>
            </>
        );
    } else if (mode === "new") return <Editor />
    else return <Editor/>;


}

export default App;
