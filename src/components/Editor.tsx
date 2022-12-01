import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';

const Editor: React.FC<{ library: { texts: [{ title: string, content: string }] }, setLibrary: Function }> = ({ library, setLibrary }) => {
    const [selectedText, setSelectedText] = useState(0);
    const [newTextMode, setNewTextMode] = useState(false);
    const [deleteTextMode, setDeleteTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);
    const newTextTitleRef = useRef<HTMLInputElement>(null);

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
        const a = document.createElement("a");
        const file = new Blob([data], { type: dataType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
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

        if (newTextTitleRef.current) newTextTitleRef.current.value = "";
        setNewTextMode(false);
    }

    const handleCancel = () => {
        if (newTextTitleRef.current) newTextTitleRef.current.value = "";
        setNewTextMode(false);
    }

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "content");

    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
            return library.texts[index][prop];
        } else return "";
    }

    const handleMoveUp = () => {
        let topOfArray = library.texts.slice(0, selectedText - 1);
        let prevElement = library.texts.slice(selectedText - 1, selectedText);
        let selectedElement = library.texts.slice(selectedText, selectedText + 1);
        let bottomOfArray = library.texts.slice(selectedText + 1);

        if (selectedText !== 0) {
            if (selectedText !== 1) {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...topOfArray, ...selectedElement, ...prevElement, ...bottomOfArray]
                }));
            } else {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...selectedElement, ...prevElement, ...bottomOfArray]
                }));
            }

            if (selectRef.current) {
                selectRef.current.value = `${selectedText - 1}`;
            }

            setSelectedText(selectedText - 1);
        }
    }

    const handleMoveDown = () => {
        let topOfArray = library.texts.slice(0, selectedText);
        let selectedElement = library.texts.slice(selectedText, selectedText + 1);
        let nextElement = library.texts.slice(selectedText + 1, selectedText + 2);
        let bottomOfArray = library.texts.slice(selectedText + 2);

        if (selectedText !== library.texts.length - 1) {
            if (selectedText !== library.texts.length - 2) {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...topOfArray, ...nextElement, ...selectedElement, ...bottomOfArray]
                }));
            } else {
                setLibrary(prevState => ({
                    ...prevState,
                    texts: [...topOfArray, ...nextElement, ...selectedElement]
                }));
            }

            if (selectRef.current) {
                selectRef.current.value = `${selectedText + 1}`;
            }

            setSelectedText(selectedText + 1);
        }
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
                <div id="text-select-container">
                    <p>EXPLORER</p>
                    <select
                        id="texts"
                        ref={selectRef}
                        className="scrollbar"
                        name="texts"
                        size={10}>
                        {library && library.texts &&
                            library.texts.map((item, index) =>
                                <option
                                    key={index}
                                    value={`${index}`}
                                    onClick={() => setSelectedText(index)}>
                                    {item.title}
                                </option>)
                        }
                    </select>
                    <button
                        onClick={handleSave}>
                        Save
                    </button>
                    <button
                        onClick={() => setNewTextMode(true)}>
                        New Text
                    </button>
                    <button onClick={handleMoveUp}>Up</button>
                    <button onClick={handleMoveDown}>Down</button>
                    <button onClick={() => setDeleteTextMode(true)}>Delete Text</button>
                </div>
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

export default Editor;
