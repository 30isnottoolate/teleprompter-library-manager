import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const Editor: React.FC<{ library?: { texts: { text_: { title: string, url: string, text: string } } }, setLibrary: Function }> = ({ library, setLibrary }) => {
    const [inputText, setInputText] = useState("");
    const [titles, setTitles] = useState([""]);
    const [selectedText, setSelectedText] = useState(1);
    const [newTextTitle, setNewTextTitle] = useState("");
    const [newTextMode, setNewTextMode] = useState(false);

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
        setInputText((library && library.texts[`text_${selectedText}`].text) ? library.texts[`text_${selectedText}`].text : "")
    }, [selectedText]);

    const handleInputChange = (event) => {
        setInputText(event.target.value)
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
                    title: newTextTitle
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

    return (
        <>
            <div id="editor">
                <div id="text-select-container">
                    <select id="texts" name="texts" size={10} disabled={newTextMode ? true : false}>
                        {titles &&
                            titles.map((item, index) => <option key={index + 1} value={index + 1} onClick={() => setSelectedText(index + 1)}>{item}</option>)
                        }
                    </select>
                    <button onClick={handleSave} disabled={newTextMode ? true : false}>Save</button>
                    <button onClick={() => setNewTextMode(true)} disabled={newTextMode ? true : false}>New Text</button>
                </div>
                <div id="text-input-container">
                    <textarea value={inputText} onChange={handleInputChange} disabled={newTextMode ? true : false}/>
                </div>
                <div id="text-display-container" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(library ? library.texts[`text_${selectedText}`].text : "") }} />
            </div>
            {newTextMode &&
                <div id="new-text-window">
                    <h3>Add new text</h3>
                    <label htmlFor="new-text-title-input">Title</label>
                    <input id="new-text-title-input" type="text" value={newTextTitle} onChange={(event) => setNewTextTitle(event.target.value)} />
                    <button onClick={handleNewText}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            }

        </>
    )
}

export default Editor;
