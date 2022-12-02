import React, { useState, useRef } from 'react';
import Icon from './Icon';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setSelectedText: Function,
    setFileModified: Function
}

const Explorer: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setSelectedText, setFileModified }: ExplorerProps) => {
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
        setFileModified(true);
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
            setFileModified(true);
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
            setFileModified(true);
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
            setFileModified(true);
        }
    }

    const handleNewTextClick = () => {
        setNewTextMode(true);
        if (newTextTitleRef.current) newTextTitleRef.current.focus(); //does not work!!!
    }

    return (
        <>
            <div id="explorer">
                <p className="section-label">EXPLORER</p>
                <div className="mini-toolbar">
                    <Icon icon={"newText"} size={20} clickHandler={handleNewTextClick} />
                    <Icon icon={"deleteText"} size={20} disabled={library.texts.length === 0 ? true : false} clickHandler={() => setDeleteTextMode(true)} />
                    <Icon icon={"moveDown"} size={20} disabled={(library.texts.length < 2 || selectedText === library.texts.length - 1) ? true : false} clickHandler={handleMoveDown} />
                    <Icon icon={"moveUp"} size={20} disabled={(library.texts.length < 2 || selectedText === 0) ? true : false} clickHandler={handleMoveUp} />
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
                <div className="dialog-box">
                        <input
                            ref={newTextTitleRef}
                            type="text"
                            placeholder="Type title here..."
                        />
                        <button className="dialog-button button-2" onClick={handleNewText}>Save</button>
                        <button className="dialog-button button-3" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            }
            {deleteTextMode &&
                <div className="dialog-screen">
                    <div className="dialog-box">
                        <p className="dialog-question">Are you sure you want to delete this text?</p>
                        <button className="dialog-button button-2" onClick={handleDelete}>Yes</button>
                        <button className="dialog-button button-3" onClick={() => setDeleteTextMode(false)}>No</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Explorer;
