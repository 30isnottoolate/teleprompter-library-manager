import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import './App.css';
import Icon from './Icon';
import Explorer from './Explorer';
import Editor from './Editor';

const App: React.FC = () => {
    const [library, setLibrary] = useState({ texts: [{ title: "My First Text", content: "" }] });
    const [selectedText, setSelectedText] = useState(0);
    const [newFileMode, setNewFileMode] = useState(false);
    const [openFileMode, setOpenFileMode] = useState(false);

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
            setOpenFileMode(false);
            if (openRef.current) openRef.current.value = "";
        }
    }

    const handleNewFile = () => {
        setLibrary({ texts: [{ title: "My First Text", content: "" }] });
        setNewFileMode(false);
    }

    const saveFile = (data: string, fileName: string, dataType: string) => {
        let pseudoSave = document.createElement("a");
        let file = new Blob([data], { type: dataType });

        pseudoSave.href = URL.createObjectURL(file);
        pseudoSave.download = fileName;
        pseudoSave.click();
    }

    const handleSave = () => {
        saveFile(JSON.stringify(library), "librarian.json", "text/plain");
    }

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "content");

    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
            return library.texts[index][prop];
        } else return "";
    }

    return (
        <>
            <div id="menu">
                <div className="toolbar">
                    <Icon icon={"newFile"} size={30} viewBox="2 0 12 16" clickHandler={() => setNewFileMode(true)} />
                    <Icon icon={"openFile"} size={30} viewBox="0 2 16 13" clickHandler={() => setOpenFileMode(true)} />
                    <Icon icon={"saveFile"} size={30} clickHandler={handleSave} />
                    <input
                        ref={openRef}
                        onChange={handleOpenFile}
                        accept=".json"
                        style={{ display: "none" }}
                        type="file"
                        name="filename"
                    />
                </div>
            </div>
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
            <div id="output">
                <div className="mini-toolbar"></div>
                <p className="section-label">OUTPUT</p>
                <div
                    id="text-display"
                    className="scrollbar"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayText()) }}
                />
            </div>
            {newFileMode &&
                <div className="dialog-screen">
                    <div className="dialog-box confirmation">
                        <p className="dialog-title">New file</p>
                        <p className="dialog-question">Are you sure?</p>
                        <button className="dialog-button" onClick={handleNewFile}>Yes</button>
                        <button className="dialog-button" onClick={() => setNewFileMode(false)}>No</button>
                    </div>
                </div>
            }
            {openFileMode &&
                <div className="dialog-screen">
                    <div className="dialog-box confirmation">
                        <p className="dialog-title">Open file</p>
                        <p className="dialog-question">Are you sure?</p>
                        <button className="dialog-button" onClick={triggerClick}>Yes</button>
                        <button className="dialog-button" onClick={() => setOpenFileMode(false)}>No</button>
                    </div>
                </div>
            }
        </>
    )
}

export default App;
