import React, { useState, useRef } from 'react';
import typeSafeProp from '../utilities/typeSafeProp';
import Icon from './Icon';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {
    const [selectionStatus, setSelectionStatus] = useState(false);

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

    const handleSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
        setSelectionStatus(event.currentTarget.selectionStart !== event.currentTarget.selectionEnd);
    }

    const selectionData = (data: string) => {
        if (data === "start") return textareaRef.current ? textareaRef.current.selectionStart : 0;
        else if (data === "end") return textareaRef.current ? textareaRef.current.selectionEnd : 0;
    }

    const markContent = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start"));
        let selectedContent = currentContent.slice(selectionData("start"), selectionData("end"));
        let bottomOfContent = currentContent.slice(selectionData("end"));

        newLibraryTexts[selectedText].content = topOfContent + "{{" + selectedContent + "}}" + bottomOfContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));
        setFileModified(true);
    }

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"mark"}
                    height={20}
                    disabled={!selectionStatus}
                    clickHandler={markContent}
                    tooltipText={"Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"unmark"}
                    height={20}
                    disabled={!selectionStatus}
                    clickHandler={() => {}}
                    tooltipText={"Remove Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"removeMarks"}
                    height={20}
                    disabled={!selectionStatus}
                    clickHandler={() => {}}
                    tooltipText={"Remove All Highlights"}
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
                onSelect={(event) => handleSelection(event)}
                placeholder="Type content here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
        </div>
    );
}

export default Editor;
