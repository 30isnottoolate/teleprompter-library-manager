import React, { RefObject } from 'react';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setSelectedText: Function,
    selectRef: RefObject<HTMLSelectElement>,
    setNewTextMode: Function,
    setDeleteTextMode: Function
}

const Explorer: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setSelectedText, selectRef, setNewTextMode, setDeleteTextMode }: ExplorerProps) => {

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
    )
}

export default Explorer;
