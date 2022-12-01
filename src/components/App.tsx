import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import './App.css';
import Explorer from './Explorer';

const App: React.FC = () => {
    const [library, setLibrary] = useState({ texts: [{ title: "My First Text", content: "" }] });
    const [selectedText, setSelectedText] = useState(0);
    const [newTextMode, setNewTextMode] = useState(false);
    const [deleteTextMode, setDeleteTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);
    const newTextTitleRef = useRef<HTMLInputElement>(null);

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

    const handleTitleChange = (event) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].title = event.target.value;

        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));
    }

    const handleContentChange = (event) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].content = event.target.value;

        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));
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

    const handleNewText = () => {
        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...prevState.texts,
                {
                    title: newTextTitleRef.current ? newTextTitleRef.current.value : "",
                    content: ""
                }
            ]
        }));

        setNewTextMode(false);
    }

    const handleCancel = () => {
        setNewTextMode(false);
    }

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "content");

    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
            return library.texts[index][prop];
        } else return "";
    }

    const handleDelete = () => {
        let topOfArray = library.texts.slice(0, selectedText);
        let bottomOfArray = library.texts.slice(selectedText + 1);

        if (library.texts.length > 0) {
            if (selectedText === 0) {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...bottomOfArray]
                }));
            } else if (selectedText === library.texts.length - 1) {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...topOfArray]
                }));
            } else {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...topOfArray, ...bottomOfArray]
                }));
            }

            if (selectRef.current) selectRef.current.value = `${selectedText - 1}`;

            setSelectedText(selectedText - 1);
            setDeleteTextMode(false);
        }
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
                    selectRef={selectRef}
                    setNewTextMode={setNewTextMode}
                    setDeleteTextMode={setDeleteTextMode}
                />
                <div id="text-input-container">
                    <p>EDITOR</p>
                    <input
                        type="text"
                        value={typeSafeProp(selectedText, "title")}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        className="scrollbar"
                        value={typeSafeProp(selectedText, "content")}
                        onChange={handleContentChange}
                        placeholder="Type something..."
                    />
                </div>
                <div id="text-display-container">
                    <p>OUTPUT</p>
                    <div
                        id="text-display"
                        className="scrollbar"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayText()) }}
                    />
                </div>
            </div>
            {newTextMode &&
                <div id="new-text-window">
                    <h3>Add new text</h3>
                    <label htmlFor="new-text-title-input">Title</label>
                    <input
                        id="new-text-title-input"
                        ref={newTextTitleRef}
                        type="text"
                    />
                    <button onClick={handleNewText}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            }
            {deleteTextMode &&
                <div id="delete-text-window">
                    <h3>Delete text</h3>
                    <h4>Are you sure?</h4>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => setDeleteTextMode(false)}>No</button>
                </div>
            }
        </>
    )
}

export default App;
