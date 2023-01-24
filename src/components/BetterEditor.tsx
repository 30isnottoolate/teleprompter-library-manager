import React, { useState, useRef } from 'react';
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

    return (
        <div id="editor">
            <p className="section-label">EDITOR</p>
            <div className="mini-toolbar">
                <Icon
                    icon={"redMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => {}}
                    tooltipText={"Highlight Selection (Red)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"greenMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => {}}
                    tooltipText={"Highlight Selection (Green)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"blueMark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => {}}
                    tooltipText={"Highlight Selection (Blue)"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"unmark"}
                    height={20}
                    disabled={false}
                    clickHandler={() => {}}
                    tooltipText={"Remove Highlight"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"removeMarks"}
                    height={20}
                    disabled={false}
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
                disabled={(library.texts.length < 1 || selectedText < 0) ? true : false}
            />
            <div
                id="editor-box"
                ref={editorRef}
                className="scrollbar"
                contentEditable={(library.texts.length < 1 || selectedText < 0) ? false : true}
                suppressContentEditableWarning={true}
                placeholder="Type content here..."
                spellCheck={false}
            />
            {deleteAllMarksMode &&
                <YesNoDialog
                    text="Are you sure you want to remove all highlights?"
                    clickHandlerOne={() => {}}
                    clickHandlerTwo={() => setDeleteAllMarksMode(false)}
                />
            }
        </div>
    );
}

export default BetterEditor;
