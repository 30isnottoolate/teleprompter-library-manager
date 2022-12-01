import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import './App.css';
import Explorer from './Explorer';
import Editor from './Editor';

const App: React.FC = () => {
    const [library, setLibrary] = useState({ texts: [{ title: "My First Text", content: "" }] });
    const [selectedText, setSelectedText] = useState(0);

    const openRef = useRef<HTMLInputElement>(null);

    const triggerClick = () => {
        if (openRef.current) openRef.current.click();
    }

    const handleOpenFile = (event) => {
        let reader = new FileReader();
        reader.onload = onFileLoading;
        reader.readAsText(event.target.files[0]);
    }

    const onFileLoading = (event) => {
        if (event.target.result) {
            setLibrary(JSON.parse(event.target.result));
            if (openRef.current) openRef.current.value = "";
        }
    }

    const handleNewFile = () => {
        setLibrary({
            texts: [
                {
                    title: "My First Text",
                    content: ""
                }
            ]
        });
    }

    const saveLibrary = (data: string, fileName: string, dataType: string) => {
        let openElement = document.createElement("a");
        let file = new Blob([data], { type: dataType });
        openElement.href = URL.createObjectURL(file);
        openElement.download = fileName;
        openElement.click();
    }

    const handleSave = () => {
        saveLibrary(JSON.stringify(library), "librarian.json", "text/plain");
    }

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "content");

    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
            return library.texts[index][prop];
        } else return "";
    }

    return (
        <>
            <div id="editor">
                <button onClick={handleNewFile}>New</button>
                <input
                    id="myFile"
                    ref={openRef}
                    onChange={handleOpenFile}
                    accept=".json"
                    style={{ display: "none" }}
                    type="file"
                    name="filename" />
                <button
                    onClick={triggerClick}
                >
                    Open
                </button>
                <button
                    onClick={handleSave}>
                    Save
                </button>
                <Explorer
                    library={library}
                    setLibrary={setLibrary}
                    selectedText={selectedText}
                    setSelectedText={setSelectedText}
                />
                <Editor
                    library={library}
                    setLibrary={setLibrary}
                    selectedText={selectedText}
                />
                <div id="text-display-container">
                    <p>OUTPUT</p>
                    <div
                        id="text-display"
                        className="scrollbar"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayText()) }}
                    />
                </div>
            </div>
        </>
    )
}

export default App;
