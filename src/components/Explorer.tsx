import React, { useState, useRef } from 'react';
import Icon from './Icon';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setSelectedText: Function
}

const Explorer: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setSelectedText }: ExplorerProps) => {
    const [newTextMode, setNewTextMode] = useState(false);
    const [deleteTextMode, setDeleteTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);
    const newTextTitleRef = useRef<HTMLInputElement>(null);

    const handleNewText = () => {
        setLibrary((prevState: typeof library) => ({
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
                setLibrary((prevState: typeof library) => ({
                    ...prevState,
                    texts: [...bottomOfArray]
                }));
            } else if (selectedText === library.texts.length - 1) {
                setLibrary((prevState: typeof library) => ({
                    ...prevState,
                    texts: [...topOfArray]
                }));
            } else {
                setLibrary((prevState: typeof library) => ({
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
                setLibrary((prevState: typeof library) => ({
                    ...prevState,
                    texts: [...topOfArray, ...selectedElement, ...prevElement, ...bottomOfArray]
                }));
            } else {
                setLibrary((prevState: typeof library) => ({
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
                setLibrary((prevState: typeof library) => ({
                    ...prevState,
                    texts: [...topOfArray, ...nextElement, ...selectedElement, ...bottomOfArray]
                }));
            } else {
                setLibrary((prevState: typeof library) => ({
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
            <div id="explorer">
                <p className="section-label">EXPLORER</p>
                <div className="mini-toolbar">
                    <Icon icon={"newText"} size={20} clickHandler={() => setNewTextMode(true)} />
                    <Icon icon={"deleteText"} size={20} clickHandler={() => setDeleteTextMode(true)} />
                    <Icon icon={"moveDown"} size={20} clickHandler={handleMoveDown} />
                    <Icon icon={"moveUp"} size={20} clickHandler={handleMoveUp} />
                </div>
                <select
                    ref={selectRef}
                    className="scrollbar"
                    size={10}>
                    {library && library.texts &&
                        library.texts.map((item: { title: string, content: string }, index: number) =>
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
                <div className="dialog-screen">
                <div className="dialog-box new-text">
                        <p className="dialog-title">Add new text</p>
                        <label htmlFor="new-text-title-input">Title</label>
                        <input
                            id="new-text-title-input"
                            ref={newTextTitleRef}
                            type="text"
                        />
                        <button className="dialog-button" onClick={handleNewText}>Save</button>
                        <button className="dialog-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            }
            {deleteTextMode &&
                <div className="dialog-screen">
                    <div className="dialog-box confirmation">
                        <p className="dialog-title">Delete text</p>
                        <p className="dialog-question">Are you sure?</p>
                        <button className="dialog-button" onClick={handleDelete}>Yes</button>
                        <button className="dialog-button" onClick={() => setDeleteTextMode(false)}>No</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Explorer;
