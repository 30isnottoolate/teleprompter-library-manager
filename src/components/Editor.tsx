import React from 'react';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number,
    setFileModified: Function
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText, setFileModified }: ExplorerProps) => {
    const typeSafeProp = (index: number, prop: string) => {
        if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
            return library.texts[index][prop];
        } else return "";
    }

    const handleTitleChange = (event) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].title = event.target.value;

        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setFileModified(true);
    }

    const handleContentChange = (event) => {
        let newLibraryTexts = [...library.texts];
        newLibraryTexts[selectedText].content = event.target.value;

        setLibrary(prevState => ({
            ...prevState,
            texts: [
                ...newLibraryTexts
            ]
        }));

        setFileModified(true);
    }

    console.log(selectedText);

    return (
        <div id="editor">
            <div className="mini-toolbar"></div>
            <p className="section-label">EDITOR</p>
            <input
                type="text"
                value={typeSafeProp(selectedText, "title")}
                onChange={handleTitleChange}
                placeholder="Type title here..."
                disabled={library.texts.length === 0 ? true : false}
            />
            <textarea
                className="scrollbar"
                value={typeSafeProp(selectedText, "content")}
                onChange={handleContentChange}
                placeholder="Type content here..."
                disabled={library.texts.length === 0 ? true : false}
            />
        </div>
    )
}

export default Editor;
