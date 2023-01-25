import React, { useState, useRef, useEffect } from 'react';
import typeSafeProp from '../utilities/typeSafeProp';
import Icon from './Icon';
import YesNoDialog from './YesNoDialog';

interface BetterEditorProps {
    library: { texts: [{ title: string, content: string }], librarian: string };
    setLibrary: Function;
    selectedText: number;
    setFileModified: Function;
}

const BetterEditor: React.FC<BetterEditorProps> = ({ library, setLibrary, selectedText, setFileModified }: BetterEditorProps) => {
    const [deleteAllMarksMode, setDeleteAllMarksMode] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current)
            editorRef.current.innerHTML = library.texts[selectedText].content;
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
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].content = editorRef.current ? editorRef.current.innerHTML : "error";

        setLibrary((prevState: typeof library) => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setFileModified(true);
    }

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        if (event.currentTarget.lastChild && event.currentTarget.lastChild.nodeName !== "BR") {
            event.currentTarget.append(document.createElement("br"));
        }

        cleanupAndStoreContent();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            insertText(`\n`);
        } else if (event.key === "Tab") {
            event.preventDefault();
            insertText(`\t`);
        }

        cleanupAndStoreContent();
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        let plainText = event.clipboardData.getData('text/plain');

        event.preventDefault();
        insertText(plainText);

        handleContentChange();
    }

    const insertText = (text: string) => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(text);

            range.deleteContents();
            range.insertNode(textNode);
            range.selectNode(textNode);
            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const removeChildlessNodes = (node: Node) => {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                if (!childNode.hasChildNodes() &&
                    childNode.nodeName !== "#text" && childNode.nodeName !== "BR") {
                    node.removeChild(childNode);
                    removeChildlessNodes(node);
                } else {
                    removeChildlessNodes(childNode);
                }
            });
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

        cleanupAndStoreContent();
    }

    const removeStyleTag = (node: Node | ChildNode | DocumentFragment, tag: string) => {
        if (node.hasChildNodes()) {

            node.childNodes.forEach((childNode) => {
                if (childNode.nodeName === tag && childNode.hasChildNodes()) {
                    childNode.replaceWith(...childNode.childNodes);
                    removeStyleTag(node, tag);
                } else if (childNode.nodeName === tag && !childNode.hasChildNodes()) {
                    node.removeChild(childNode);
                    removeStyleTag(node, tag);
                } else if (childNode.hasChildNodes()) {
                    removeStyleTag(childNode, tag);
                }
            });
        }
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

            if (startNode.parentNode && startNode.parentNode.nodeName !== "DIV" && endNode.parentNode && endNode.parentNode.nodeName !== "DIV") {
                range.setStartBefore(startNode.parentNode);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(endNode.parentNode);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStartBefore(startNode.parentNode);
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

        cleanupAndStoreContent();
    }

    const removeAllHighlights = () => {
        editorRef.current && removeStyleTag(editorRef.current, "SPAN");
        setDeleteAllMarksMode(false);
        cleanupAndStoreContent();
    }

    const cleanupAndStoreContent = () => {
        if (editorRef.current) {
            editorRef.current.normalize();
            removeChildlessNodes(editorRef.current);
        }

        handleContentChange();
    }

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"redMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => applyHighlight("#f87171")}
                    tooltipText={"Highlight Selection (Red)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"greenMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => applyHighlight("#4ade80")}
                    tooltipText={"Highlight Selection (Green)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"blueMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => applyHighlight("#38bdf8")}
                    tooltipText={"Highlight Selection (Blue)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"unmark"}
                    height={20}
                    disabled={false}
                    clickHandler={removeHighlight}
                    tooltipText={"Remove Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"removeMarks"}
                    height={20}
                    disabled={false}
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
                onInput={event => handleInput(event)}
                onKeyDown={event => handleKeyDown(event)}
                onPaste={event => handlePaste(event)}
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

export default BetterEditor;
