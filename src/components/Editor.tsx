import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { typeSafeProp, insertText, ancestorNode, removeChildlessNodes, removeStyleTag } from '../utilities/helperFunctions';
import Icon from './Icon';
import YesNoDialog from './YesNoDialog';

interface EditorProps {
    library: { texts: { title: string, content: string }[], librarian: string };
    setLibrary: Function;
    selectedText: number;
    setFileModified: Function;
}

const Editor: React.FC<EditorProps> = (
    { library, setLibrary, selectedText, setFileModified }: EditorProps) => {

    const [selectionExist, setSelectionExist] = useState(false);
    const [selectionHasHighlight, setSelectionHasHighlight] = useState(false);
    const [highlightExists, setHighlightExists] = useState(false);
    const [deleteAllMarksMode, setDeleteAllMarksMode] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current)
            editorRef.current.innerHTML = DOMPurify.sanitize(typeSafeProp(library, selectedText, "content"));
    }, [selectedText]);

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

    const handleContentChange = () => {
        if (editorRef.current) {
            if (editorRef.current.lastChild && editorRef.current.lastChild.nodeName !== "BR") {
                editorRef.current.append(document.createElement("br"));
            }

            editorRef.current.normalize();
            removeChildlessNodes(editorRef.current);

            findHighlights();

            let newLibraryTexts = [...library.texts];
            newLibraryTexts[selectedText].content = editorRef.current.innerHTML;

            setLibrary((prevState: typeof library) => ({
                ...prevState,
                texts: [
                    ...newLibraryTexts
                ]
            }));

            setFileModified(true);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            insertText(`\n`);
        } else if (event.key === "Tab") {
            event.preventDefault();
            insertText(`\t`);
        }

        handleContentChange();
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        let plainText = event.clipboardData.getData('text/plain');

        event.preventDefault();
        insertText(plainText);

        handleContentChange();
    }

    const handleSelection = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount) {
            if (selection.toString().length !== 0) {
                setSelectionExist(true);
            } else setSelectionExist(false);

            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();

            if (range.startContainer.parentNode && range.startContainer.parentNode.nodeName === "SPAN" ||
                range.endContainer.parentNode && range.endContainer.parentNode.nodeName === "SPAN") {
                setSelectionHasHighlight(true);

            } else if (selectionFrag.hasChildNodes()) {
                [...selectionFrag.childNodes].forEach(node => {
                    if (node.nodeName === "SPAN" || (node.parentNode && node.parentNode.nodeName === "SPAN")) {
                        setSelectionHasHighlight(true);
                    }
                })
            } else setSelectionHasHighlight(false);
        }
    }

    const applyHighlight = (color: string) => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();
            const spanNode = document.createElement("SPAN");

            spanNode.style.color = color;
            spanNode.className = "font-color"

            removeStyleTag(selectionFrag, "SPAN");

            spanNode.appendChild(selectionFrag);

            range.deleteContents();
            range.insertNode(spanNode);
            range.selectNode(spanNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        handleContentChange();
    }

    const removeHighlight = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);

            const startNode = range.startContainer;
            const endNode = range.endContainer;
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            const selectionFrag = range.cloneContents();

            removeStyleTag(selectionFrag, "SPAN");

            if (startNode.parentNode && startNode.parentNode.nodeName !== "DIV" &&
                endNode.parentNode && endNode.parentNode.nodeName !== "DIV") {

                range.setStartBefore(ancestorNode(startNode));
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(ancestorNode(endNode));
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStartBefore(ancestorNode(startNode));
                range.deleteContents();

                range.insertNode(startFrag);
                range.collapse(false);
                range.insertNode(endFrag);
                range.collapse(true);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                range.deleteContents();
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        handleContentChange();
    }

    const removeAllHighlights = () => {
        if (editorRef.current && editorRef.current.innerHTML.length !== 0) {
            removeStyleTag(editorRef.current, "SPAN");
            setDeleteAllMarksMode(false);
        }

        handleContentChange();
    }

    const findHighlights = () => {
        setHighlightExists(false);

        if (editorRef.current && editorRef.current.hasChildNodes()) {
            [...editorRef.current.childNodes].forEach(node => {
                if (node.nodeName === "SPAN") setHighlightExists(true);
            });
        }
    }

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"redMark"}
                    height={20}
                    disabled={selectionExist ? false : true}
                    clickHandler={() => applyHighlight("#f87171")}
                    tooltipText={"Highlight Selection (Red)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"greenMark"}
                    height={20}
                    disabled={selectionExist ? false : true}
                    clickHandler={() => applyHighlight("#4ade80")}
                    tooltipText={"Highlight Selection (Green)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"blueMark"}
                    height={20}
                    disabled={selectionExist ? false : true}
                    clickHandler={() => applyHighlight("#38bdf8")}
                    tooltipText={"Highlight Selection (Blue)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"unmark"}
                    height={20}
                    disabled={selectionExist && selectionHasHighlight ? false : true}
                    clickHandler={removeHighlight}
                    tooltipText={"Remove Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"removeMarks"}
                    height={20}
                    disabled={highlightExists ? false : true}
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
            <div
                id="editor-box"
                ref={editorRef}
                className="scrollbar"
                onKeyDown={event => handleKeyDown(event)}
                onPaste={event => handlePaste(event)}
                onSelect={handleSelection}
                contentEditable={(library.texts.length < 1 || selectedText < 0) ? false : true}
                suppressContentEditableWarning={true}
                placeholder="Type content here..."
                spellCheck={false}
            />
            {deleteAllMarksMode &&
                <YesNoDialog
                    text="Are you sure you want to remove all highlights?"
                    clickHandlerOne={removeAllHighlights}
                    clickHandlerTwo={() => setDeleteAllMarksMode(false)}
                />
            }
        </div>
    );
}

export default Editor;
