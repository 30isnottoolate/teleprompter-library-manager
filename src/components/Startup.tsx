import React, { useState, useRef } from 'react';

const Startup: React.FC<{ setLibrary: Function, setMode: Function }> = ({ setLibrary, setMode }) => {
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
        if (event.target.result) {
            setLibrary(JSON.parse(event.target.result));
            setMode("open");
        }
    }

    const handleNewFile = () => {
        setMode("new");
    }

    return (
        <div id="start-menu">
            <h1>Library Manager</h1>
            <h2>for KV Teleprompter</h2>
            <div id="start-buttons">
                <button
                    className="start-button"
                    onClick={handleNewFile}
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
    );


}

export default Startup;
