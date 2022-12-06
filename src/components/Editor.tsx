import React, { useState, useEffect, useRef } from 'react';
import typeSafeProp from '../utilities/typeSafeProp';
import Icon from './Icon';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {
    const [selectionExists, setSelectionExists] = useState(false);
    const [selectionHasMarks, setSelectionHasMarks] = useState(false);
    const [contentHasMarks, setContentHasMarks] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        let currentContent = library.texts[selectedText].content;

        if (currentContent.includes("{{") || currentContent.includes("}}")) {
            setContentHasMarks(true);
        } else setContentHasMarks(false);

        setSelectionExists(false);

    }, [library.texts[selectedText].content, selectedText]);

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

    const handleSelection = () => {
        let currentContent = library.texts[selectedText].content;
        let selectedContent = currentContent.slice(selectionData("start") - 2, selectionData("end") + 2);

        if (selectionData("start") !== selectionData("end")) {
            setSelectionExists(true);

            if (selectedContent.includes("{{") && selectedContent.includes("}}")) {
                setSelectionHasMarks(true);
            } else setSelectionHasMarks(false);
        }
    }

    const selectionData = (data: string) => {
        if (data === "start") return textareaRef.current ? textareaRef.current.selectionStart : 0;
        else if (data === "end") return textareaRef.current ? textareaRef.current.selectionEnd : 0;
        else return 0;
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

        setSelectionExists(false);
        setFileModified(true);
    }

    const unmarkContent = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start") - 2);
        let selectedContent = currentContent.slice(selectionData("start") - 2, selectionData("end") + 2);
        let bottomOfContent = currentContent.slice(selectionData("end") + 2);

        selectedContent = selectedContent.replaceAll("{{", "").replaceAll("}}", "");
        newLibraryTexts[selectedText].content = topOfContent + selectedContent + bottomOfContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setSelectionExists(false);
        setFileModified(true);
    }

    const removeAllMarks = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        currentContent = currentContent.replaceAll("{{", "").replaceAll("}}", "");
        newLibraryTexts[selectedText].content = currentContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setSelectionExists(false);
        setFileModified(true);
    }

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"mark"}
                    height={20}
                    disabled={!(selectionExists && !selectionHasMarks)}
                    clickHandler={markContent}
                    tooltipText={"Highlight Selection"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"unmark"}
                    height={20}
                    disabled={!(selectionExists && selectionHasMarks)}
                    clickHandler={unmarkContent}
                    tooltipText={"Remove Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"removeMarks"}
                    height={20}
                    disabled={!contentHasMarks}
                    clickHandler={removeAllMarks}
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
                onSelect={handleSelection}
                placeholder="Type content here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
        </div>
    );
}

export default Editor;
