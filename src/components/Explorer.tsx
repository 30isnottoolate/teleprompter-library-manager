import React, { useState, useRef, RefObject } from 'react';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setSelectedText: Function,
    selectRef: RefObject<HTMLSelectElement>
}

const Explorer: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setSelectedText, selectRef }: ExplorerProps) => {
    const [newTextMode, setNewTextMode] = useState(false);
    const [deleteTextMode, setDeleteTextMode] = useState(false);

    const newTextTitleRef = useRef<HTMLInputElement>(null);

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

    const handleCancel = () => {
        setNewTextMode(false);
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

    return (
        <>
            <div id="text-select-container">
                <p>EXPLORER</p>
                <button
                    onClick={() => setNewTextMode(true)}>
                    New Text
                </button>
                <button onClick={() => setDeleteTextMode(true)}>Delete Text</button>
                <button onClick={handleMoveUp}>Up</button>
                <button onClick={handleMoveDown}>Down</button>
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

export default Explorer;
