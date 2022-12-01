import React from 'react';

interface ExplorerProps {
    library: any,
    setLibrary: Function,
    selectedText: number
}

const Editor: React.FC<ExplorerProps> = ({ library, setLibrary, selectedText  }: ExplorerProps) => {
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
    }

    return (
        <div id="text-input-container">
            <p>EDITOR</p>
            <input
                type="text"
                value={typeSafeProp(selectedText, "title")}
                onChange={handleTitleChange}
            />
            <textarea
                className="scrollbar"
                value={typeSafeProp(selectedText, "content")}
                onChange={handleContentChange}
                placeholder="Type something..."
            />
        </div>
    )
}

export default Editor;
