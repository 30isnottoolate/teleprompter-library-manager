import React, { useState, useRef } from 'react';
import Icon from './Icon';
import InputDialog from './InputDialog';
import DeletionDialog from './DeletionDialog';

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
    const newTextTitleInputRef = useRef<HTMLInputElement>(null);

    const handleNewText = () => {
        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...prevState.texts,
                {
                    title: newTextTitleInputRef.current ? newTextTitleInputRef.current.value : "",
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
        if (newTextTitleInputRef.current) newTextTitleInputRef.current.focus(); //does not work!!!
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
                <InputDialog
                    newTextTitleInputRef={newTextTitleInputRef}
                    clickHandlerOne={handleNewText}
                    clickHandlerTwo={handleCancel}
                />
            }
            {deleteTextMode &&
                <DeletionDialog
                    clickHandlerOne={handleDelete}
                    clickHandlerTwo={() => setDeleteTextMode(false)}
                />
            }
        </>
    )
}

export default Explorer;
