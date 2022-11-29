import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const Editor: React.FC<{ library?: { texts: { text_: { title: string, url: string, text: string } } }, setLibrary: Function }> = ({ library, setLibrary }) => {
    const [inputText, setInputText] = useState("");
    const [titles, setTitles] = useState([""]);
    const [selectedText, setSelectedText] = useState(1);

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

    return (
        <div id="editor">
            <div id="text-select-container">
                <select id="texts" name="texts" size={10}>
                    {titles &&
                        titles.map((item, index) => <option key={index + 1} value={index + 1} onClick={() => setSelectedText(index + 1)}>{item}</option>)
                    }
                </select>
            </div>
            <div id="text-input-container">
                <textarea value={inputText} onChange={handleInputChange} />
            </div>
            <div id="text-display-container" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(library ? library.texts[`text_${selectedText}`].text : "") }} />
        </div>
    )
}

export default Editor;
