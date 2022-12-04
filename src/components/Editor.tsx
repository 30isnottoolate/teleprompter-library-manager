import React from 'react';
import typeSafeProp from '../utilities/typeSafeProp';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {

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

    return (
        <div id="editor">
            <div className="mini-toolbar"></div>
            <p className="section-label">EDITOR</p>
            <input
                type="text"
                value={typeSafeProp(library, selectedText, "title")}
                onChange={handleTitleChange}
                placeholder="Type title here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
            <textarea
                className="scrollbar"
                value={typeSafeProp(library, selectedText, "content")}
                onChange={handleContentChange}
                placeholder="Type content here..."
                disabled={(library.texts.length === 0 || selectedText < 0) ? true : false}
            />
        </div>
    );
}

export default Editor;
