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

            if (checkForMarkSyntax(currentContent)) {
                setContentHasMarks(true);
            } else setContentHasMarks(false);

            setSelectionExists(false);
        }
    }, [library.texts, selectedText]);

    const checkForMarkSyntax = (text: string) => {
        return text.includes("{r{") || text.includes("}r}") ||
            text.includes("{g{") || text.includes("}g}") ||
            text.includes("{b{") || text.includes("}b}");
    }

    const removeMarkSyntax = (text: string) => {
        return text.
            replace(/{r{/g, "").replace(/}r}/g, "").
            replace(/{g{/g, "").replace(/}g}/g, "").
            replace(/{b{/g, "").replace(/}b}/g, "");
    }

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
        let selectedContent = currentContent.slice(selectionData("start"), selectionData("end"));
        let bufferedSelection = currentContent.slice(selectionData("start") - 3, selectionData("end") + 3);

        if (selectionData("start") !== selectionData("end") && selectedContent !== ` ` && selectedContent !== `\n`) {
            setSelectionExists(true);

            if (checkForMarkSyntax(bufferedSelection)) {
                setSelectionHasMarks(true);
            } else setSelectionHasMarks(false);
            
        } else setSelectionExists(false);
    }

    const selectionData = (data: string) => {
        if (data === "start") return textareaRef.current ? textareaRef.current.selectionStart : 0;
        else if (data === "end") return textareaRef.current ? textareaRef.current.selectionEnd : 0;
        else return 0;
    }

    const markContent = (color: string) => {
        let currentContent = library.texts[selectedText].content;
        let newLibraryTexts = [...library.texts];

        let topOfContent = currentContent.slice(0, selectionData("start") - 3);
        let topBufferOfContent = removeMarkSyntax(currentContent.slice(selectionData("start") - 3, selectionData("start")));
        let selectedContent = removeMarkSyntax(currentContent.slice(selectionData("start"), selectionData("end")));
        let bottomBufferOfContent = removeMarkSyntax(currentContent.slice(selectionData("end"), selectionData("end") + 3));
        let bottomOfContent = currentContent.slice(selectionData("end") + 3);

        newLibraryTexts[selectedText].content = topOfContent + topBufferOfContent +
            `{${color}{` + selectedContent + `}${color}}` + bottomBufferOfContent + bottomOfContent;

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

        newLibraryTexts[selectedText].content = topOfContent + removeMarkSyntax(selectedContent) + bottomOfContent;

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

        newLibraryTexts[selectedText].content = removeMarkSyntax(currentContent);

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
                    clickHandler={() => markContent("r")}
                    tooltipText={"Highlight Selection (Red)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"greenMark"}
                    height={20}
                    disabled={!(selectionExists)}
                    clickHandler={() => markContent("g")}
                    tooltipText={"Highlight Selection (Green)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"blueMark"}
                    height={20}
                    disabled={!(selectionExists)}
                    clickHandler={() => markContent("b")}
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
