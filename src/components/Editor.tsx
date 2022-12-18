import React, { useState, useEffect, useRef } from 'react';
import typeSafeProp from '../utilities/typeSafeProp';
import Icon from './Icon';
import YesNoDialog from './YesNoDialog';

interface ExplorerProps {
    library: { texts: [{ title: string, content: string }], librarian: string },
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {
    const [selectionExists, setSelectionExists] = useState(false);
    const [selectionHasMarks, setSelectionHasMarks] = useState(false);
    const [contentHasMarks, setContentHasMarks] = useState(false);
    const [deleteAllMarksMode, setDeleteAllMarksMode] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (library.texts[selectedText] && library.texts[selectedText].content) {
            let currentContent = library.texts[selectedText].content;

            if (currentContent.includes("{{") || currentContent.includes("}}")) {
                setContentHasMarks(true);
            } else setContentHasMarks(false);

            setSelectionExists(false);
        }
    }, [library.texts, selectedText]);

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

            if (selectedContent.includes("{r{") || selectedContent.includes("}r}") ||
                selectedContent.includes("{g{") || selectedContent.includes("}g}") ||
                selectedContent.includes("{b{") || selectedContent.includes("}b}")) {
                setSelectionHasMarks(true);
            } else setSelectionHasMarks(false);
        } else setSelectionExists(false);
    }

    const selectionData = (data: string) => {
        if (data === "start") return textareaRef.current ? textareaRef.current.selectionStart : 0;
        else if (data === "end") return textareaRef.current ? textareaRef.current.selectionEnd : 0;
        else return 0;
    }

    const markContentRed = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start") - 3);

        let topBorderOfSelection = currentContent.slice(selectionData("start") - 3, selectionData("start"))
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let selectedContent = currentContent.slice(selectionData("start"), selectionData("end"))
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let bottomBorderOfSelection = currentContent.slice(selectionData("end"), selectionData("end") + 3)
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let bottomOfContent = currentContent.slice(selectionData("end") + 3);

        newLibraryTexts[selectedText].content = topOfContent + topBorderOfSelection +
            "{r{" + selectedContent + "}r}" + bottomBorderOfSelection + bottomOfContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setSelectionExists(false);
        setFileModified(true);
    }

    const markContentGreen = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start") - 3);

        let topBorderOfSelection = currentContent.slice(selectionData("start") - 3, selectionData("start"))
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let selectedContent = currentContent.slice(selectionData("start"), selectionData("end"))
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let bottomBorderOfSelection = currentContent.slice(selectionData("end"), selectionData("end") + 3)
            .replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        let bottomOfContent = currentContent.slice(selectionData("end") + 3);

        newLibraryTexts[selectedText].content = topOfContent + topBorderOfSelection +
            "{g{" + selectedContent + "}g}" + bottomBorderOfSelection + bottomOfContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setSelectionExists(false);
        setFileModified(true);
    }

    const markContentBlue = () => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start"));
        let selectedContent = currentContent.slice(selectionData("start"), selectionData("end"));
        let bottomOfContent = currentContent.slice(selectionData("end"));

        newLibraryTexts[selectedText].content = topOfContent + "{b{" + selectedContent + "}b}" + bottomOfContent;

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

        let topOfContent = currentContent.slice(0, selectionData("start") - 3);
        let selectedContent = currentContent.slice(selectionData("start") - 3, selectionData("end") + 3);
        let bottomOfContent = currentContent.slice(selectionData("end") + 3);

        selectedContent = selectedContent.replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

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

        currentContent = currentContent.replace(/{r{/g, "").replace(/}r}/g, "")
            .replace(/{g{/g, "").replace(/}g}/g, "")
            .replace(/{b{/g, "").replace(/}b}/g, "");

        newLibraryTexts[selectedText].content = currentContent;

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setSelectionExists(false);
        setFileModified(true);
        setDeleteAllMarksMode(false);
    }

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"redMark"}
                    height={20}
                    disabled={!(selectionExists)}
                    clickHandler={markContentRed}
                    tooltipText={"Highlight Selection (Red)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"greenMark"}
                    height={20}
                    disabled={!(selectionExists)}
                    clickHandler={markContentGreen}
                    tooltipText={"Highlight Selection (Green)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"blueMark"}
                    height={20}
                    disabled={!(selectionExists)}
                    clickHandler={markContentBlue}
                    tooltipText={"Highlight Selection (Blue)"}
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
                    clickHandler={() => setDeleteAllMarksMode(true)}
                    tooltipText={"Remove All Highlights"}
                    tooltipCentered={true}
                />
            </div>
            <input
                type="text"
                value={typeSafeProp(library, selectedText, "title")}
                onChange={handleTitleChange}
                placeholder="Type title here..."
                disabled={(library.texts.length < 1 || selectedText < 0) ? true : false}
            />
            <textarea
                className="scrollbar"
                ref={textareaRef}
                value={typeSafeProp(library, selectedText, "content")}
                onChange={handleContentChange}
                onSelect={handleSelection}
                onClick={handleSelection}
                placeholder="Type content here..."
                disabled={(library.texts.length < 1 || selectedText < 0) ? true : false}
            />
            {deleteAllMarksMode &&
                <YesNoDialog
                    text="Are you sure you want to remove all highlights?"
                    clickHandlerOne={removeAllMarks}
                    clickHandlerTwo={() => setDeleteAllMarksMode(false)}
                />
            }
        </div>
    );
}

export default Editor;
