import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const Editor: React.FC<{ library: { texts: [{ title: string, content: string }] }, setLibrary: Function }> = ({ library, setLibrary }) => {
    const [selectedText, setSelectedText] = useState(0);
    const [newTextMode, setNewTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);
    const newTextTitleRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (event) => {
        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...prevState.texts,
                prevState.texts[selectedText].title = event.target.value
            ]
        }));
    }

    const handleContentChange = (event) => {
        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...prevState.texts,
                prevState.texts[selectedText].content = event.target.value
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

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "text");

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
        }
    }

    return (
        <>
            <div id="editor">
                <div id="text-select-container">
                    <select
                        id="texts"
                        ref={selectRef}
                        name="texts"
                        size={10}
                        disabled={newTextMode ? true : false}>
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
                        onClick={handleSave}
                        disabled={newTextMode ? true : false}>
                        Save
                    </button>
                    <button
                        onClick={() => setNewTextMode(true)}
                        disabled={newTextMode ? true : false}>
                        New Text
                    </button>
                    <button onClick={handleMoveUp}>Up</button>
                    <button onClick={handleMoveDown}>Down</button>
                    <button onClick={handleDelete}>Delete Text</button>
                </div>
                <div id="text-input-container">
                    <input
                        type="text"
                        value={typeSafeProp(selectedText, "title")}
                        onChange={handleTitleChange}
                        disabled={newTextMode ? true : false}
                    />
                    <textarea
                        value={typeSafeProp(selectedText, "text")}
                        onChange={handleContentChange}
                        placeholder="Type something..."
                        disabled={newTextMode ? true : false}
                    />
                </div>
                <div
                    id="text-display-container"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayText()) }}
                />
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
        </>
    )
}

export default Editor;
