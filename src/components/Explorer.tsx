import React, { useState, useRef, useEffect } from 'react';
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

const Explorer: React.FC<ExplorerProps> = ({
    library, setLibrary, selectedText, setSelectedText, setFileModified }: ExplorerProps) => {

    const [newTextMode, setNewTextMode] = useState(false);
    const [deleteTextMode, setDeleteTextMode] = useState(false);

    const selectRef = useRef<HTMLSelectElement>(null);
    const newTextTitleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectRef.current) selectRef.current.value = selectedText.toString();
    }, [selectedText, library.texts.length]);

    const newText = () => {
        setLibrary((prevState: typeof library) => {
            setSelectedText(prevState.texts.length);
            return ({
                ...prevState,
                texts: [
                    ...prevState.texts,
                    {
                        title: newTextTitleInputRef.current ? newTextTitleInputRef.current.value : "",
                        content: ""
                    }
                ]
            });
        });

        setNewTextMode(false);
        setFileModified(true);
    }

    const deleteText = () => {
        let topOfArray = library.texts.slice(0, selectedText);
        let bottomOfArray = library.texts.slice(selectedText + 1);

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

        if ((selectedText === 0 && library.texts.length === 1) || selectedText !== 0) {
            setSelectedText((prevState: number) => (prevState - 1));
        }

        setDeleteTextMode(false);
        setFileModified(true);
    }

    const moveUpText = () => {
        let topOfArray = library.texts.slice(0, selectedText - 1);
        let prevElement = library.texts.slice(selectedText - 1, selectedText);
        let selectedElement = library.texts.slice(selectedText, selectedText + 1);
        let bottomOfArray = library.texts.slice(selectedText + 1);

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

        setSelectedText((prevState: number) => (prevState - 1));
        setFileModified(true);
    }

    const moveDownText = () => {
        let topOfArray = library.texts.slice(0, selectedText);
        let selectedElement = library.texts.slice(selectedText, selectedText + 1);
        let nextElement = library.texts.slice(selectedText + 1, selectedText + 2);
        let bottomOfArray = library.texts.slice(selectedText + 2);

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

        setSelectedText((prevState: number) => (prevState + 1));
        setFileModified(true);
    }

    return (
        <>
            <div id="explorer">
                <p className="section-label">EXPLORER</p>
                <div className="mini-toolbar">
                    <Icon
                        icon={"newText"}
                        size={20}
                        clickHandler={() => setNewTextMode(true)}
                    />
                    <Icon
                        icon={"deleteText"}
                        size={20}
                        clickHandler={() => setDeleteTextMode(true)}
                        disabled={library.texts.length === 0 ? true : false}
                    />
                    <Icon
                        icon={"moveDown"}
                        size={20}
                        clickHandler={moveDownText}
                        disabled={(library.texts.length < 2 || selectedText === library.texts.length - 1) ? true : false}
                    />
                    <Icon
                        icon={"moveUp"}
                        size={20}
                        clickHandler={moveUpText}
                        disabled={(library.texts.length < 2 || selectedText === 0) ? true : false}
                    />
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
                    clickHandlerOne={newText}
                    clickHandlerTwo={() => setNewTextMode(false)}
                />
            }
            {deleteTextMode &&
                <DeletionDialog
                    clickHandlerOne={deleteText}
                    clickHandlerTwo={() => setDeleteTextMode(false)}
                />
            }
        </>
    );
}

export default Explorer;
