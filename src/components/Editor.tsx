import React, { useRef } from 'react';
import typeSafeProp from '../utilities/typeSafeProp';
import Icon from './Icon';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].title = event.target.value;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setFileModified(true);
    }

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].content = event.target.value;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setFileModified(true);
    }

    const markContent = () => {
        if (textareaRef.current) {
            let selectionStart = textareaRef.current.selectionStart;
            let selectionEnd = textareaRef.current.selectionEnd;

            if (selectionStart !== selectionEnd) {
                let currentContent = library.texts[selectedText].content;
                let newLibraryTexts = [...library.texts];

                let topOfContent = currentContent.slice(0, selectionStart);
                let selectedContent = currentContent.slice(selectionStart, selectionEnd);
                let bottomOfContent = currentContent.slice(selectionEnd);

                newLibraryTexts[selectedText].content = topOfContent + "<i>" + selectedContent + "</i>" + bottomOfContent;

                setLibrary((prevState: typeof library) => ({
                    ...prevState,
                    texts: [
                        ...newLibraryTexts
                    ]
                }));
                setFileModified(true);
            }
        }
    }

    return (
        <div id="editor">
            <p className="section-label" onClick={markContent}>EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"mark"}
                    height={20}
                    clickHandler={markContent}
                    tooltipText={"Highlight Selection"}
                    tooltipCentered={true}
                />
            </div>
            <input
                type="text"
                value={typeSafeProp(library, selectedText, "title")}
                onChange={handleTitleChange}
                placeholder="Type title here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
            <textarea
                className="scrollbar"
                ref={textareaRef}
                value={typeSafeProp(library, selectedText, "content")}
                onChange={handleContentChange}
                placeholder="Type content here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
        </div>
    );
}

export default Editor;
