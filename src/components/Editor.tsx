import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const Editor: React.FC<{ library?: { texts: { text_1: { title: string, text: string } } }, setLibrary: Function }> = ({ library, setLibrary }) => {
    const [currentText, setCurrentText] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");
    const [titles, setTitles] = useState([""]);
    const [selectedText, setSelectedText] = useState(1);
    const [newTextTitle, setNewTextTitle] = useState("");
    const [newTextMode, setNewTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (library) {
            let titlesHolder = [""];

            for (const item in library.texts) {
                titlesHolder.push(library.texts[item as keyof typeof library.texts].title);
            }

            titlesHolder.shift();
            setTitles(titlesHolder);
        }

    }, [library]);

    useEffect(() => {
        setCurrentTitle(typeSafeProp(selectedText, "title"));
        setCurrentText(typeSafeProp(selectedText, "text"));
    }, [currentTitle, currentText, selectedText]);

    const handleInputChange = (event) => {
        setCurrentText(event.target.value);
        setLibrary(prevState => ({
            ...prevState,
            texts: {
                ...prevState.texts,
                [`text_${selectedText}`]: {
                    ...prevState.texts[`text_${selectedText}`],
                    text: event.target.value
                }
            }
        }));
    }

    const saveLibrary = (content: string, fileName: string, contentType: string) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    const handleSave = () => {
        saveLibrary(JSON.stringify(library), "librarian.json", "text/plain");
    }

    const handleNewText = () => {
        let numberOfTitles = library ? Object.keys(library.texts).length : 0;

        setLibrary(prevState => ({
            ...prevState,
            texts: {
                ...prevState.texts,
                [`text_${numberOfTitles + 1}`]: {
                    title: newTextTitle,
                    text: ""
                }
            }
        }));

        setNewTextTitle("");
        setNewTextMode(false);
    }

    const handleCancel = () => {
        setNewTextTitle("");
        setNewTextMode(false);
    }

    const handleTitleChange = (event) => {
        setCurrentTitle(event.target.value);

        setLibrary(prevState => ({
            ...prevState,
            texts: {
                ...prevState.texts,
                [`text_${selectedText}`]: {
                    ...prevState.texts[`text_${selectedText}`],
                    title: event.target.value
                }
            }
        }));
    }

    const displayText = () => typeSafeProp(selectedText, "title") + "<br/><br/>" + typeSafeProp(selectedText, "text");

    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[`text_${index}`] && library.texts[`text_${index}`][prop]) {
            return library.texts[`text_${index}`][prop];
        } else return "";
    }

    const handleMoveUp = () => {
        if (selectedText !== 1) {
            setLibrary(prevState => ({
                ...prevState,
                texts: {
                    ...prevState.texts,
                    [`text_${selectedText - 1}`]: {
                        title: typeSafeProp(selectedText, "title"),
                        text: typeSafeProp(selectedText, "text")
                    },
                    [`text_${selectedText}`]: {
                        title: typeSafeProp(selectedText - 1, "title"),
                        text: typeSafeProp(selectedText - 1, "text")
                    }
                }
            }));

            setSelectedText(selectedText - 1);
            if (selectRef.current) {
                selectRef.current.value = `${selectedText - 1}`;
            }
        }
    }

    const handleMoveDown = () => {
        if (selectedText !== (library ? Object.keys(library.texts).length : 0)) {
            setLibrary(prevState => ({
                ...prevState,
                texts: {
                    ...prevState.texts,
                    [`text_${selectedText}`]: {
                        title: typeSafeProp(selectedText + 1, "title"),
                        text: typeSafeProp(selectedText + 1, "text")
                    },
                    [`text_${selectedText + 1}`]: {
                        title: typeSafeProp(selectedText, "title"),
                        text: typeSafeProp(selectedText, "text")
                    }
                }
            }));

            setSelectedText(selectedText + 1);
            if (selectRef.current) {
                selectRef.current.value = `${selectedText + 1}`;
            }
        }
    }

    const handleDelete = () => {
        if (library) {
            delete library.texts[`text_${selectedText}`];
            setSelectedText(prevState => prevState - 1);
            if (selectRef.current) {
                selectRef.current.value = `${selectedText - 1}`;
            }
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
                        {titles &&
                            titles.map((item, index) =>
                                <option
                                    key={index + 1}
                                    value={`${index + 1}`}
                                    onClick={() => setSelectedText(index + 1)}>
                                    {item}
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
                        value={currentTitle}
                        onChange={handleTitleChange}
                        disabled={newTextMode ? true : false}
                    />
                    <textarea
                        value={currentText}
                        onChange={handleInputChange}
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
                        type="text"
                        value={newTextTitle}
                        onChange={event => setNewTextTitle(event.target.value)}
                    />
                    <button onClick={handleNewText}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            }
        </>
    )
}

export default Editor;
