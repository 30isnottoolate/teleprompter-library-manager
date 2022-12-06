import React, { useState, useRef } from 'react';
import './App.css';
import typeSafeProp from '../utilities/typeSafeProp';
import Menu from './Menu';
import Explorer from './Explorer';
import Editor from './Editor';
import Output from './Output';
import NewOpenDialog from './NewOpenDialog';

const App: React.FC = () => {
    const [library, setLibrary] = useState<{ texts: [{ title: string, content: string }] }>
        ({ texts: [{ title: "My First Text", content: "" }] });

    const [selectedText, setSelectedText] = useState(0);
    const [fileModified, setFileModified] = useState(false);
    const [newFileMode, setNewFileMode] = useState(false);
    const [openFileMode, setOpenFileMode] = useState(false);

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleNewFileClick = () => {
        if (fileModified) setNewFileMode(true);
        else newFile();
    }

    const newFile = () => {
        setLibrary({ texts: [{ title: "My First Text", content: "" }] });
        setSelectedText(0);
        setFileModified(false);
        setNewFileMode(false);
    }

    const handleOpenFileClick = () => {
        if (fileModified) setOpenFileMode(true);
        else triggerInputFileClick();
    }

    const triggerInputFileClick = () => {
        if (inputFileRef.current) inputFileRef.current.click();
    }

    const openFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();

        const readFile = (event: ProgressEvent<FileReader>) => {
            if (event.target && event.target.result) {
                setLibrary(JSON.parse(event.target.result.toString()));
                setFileModified(false);
                setOpenFileMode(false);
                if (inputFileRef.current) inputFileRef.current.value = "";
            }
        }

        reader.onload = readFile;
        if (event.target.files) reader.readAsText(event.target.files[0]);
        setSelectedText(0);
    }

    const handleSaveFileClick = () => {
        let pseudoSave = document.createElement("a");
        let file = new Blob([JSON.stringify(library)], { type: "text/plain" });

        pseudoSave.href = URL.createObjectURL(file);
        pseudoSave.download = "library.json";
        pseudoSave.click();

        setFileModified(false);
        setNewFileMode(false);
        setOpenFileMode(false);
    }

    const displayText = () => {
        return typeSafeProp(library, selectedText, "title") +
            "<br/><br/>" + typeSafeProp(library, selectedText, "content").replaceAll("{{", "<span>").replaceAll("}}", "</span>");
    }

    return (
        <>
            <Menu
                handleNewFileClick={handleNewFileClick}
                handleOpenFileClick={handleOpenFileClick}
                handleSaveFileClick={handleSaveFileClick}
                openFile={openFile}
                inputFileRef={inputFileRef}
            />
            <main>
                <Explorer
                    library={library}
                    setLibrary={setLibrary}
                    selectedText={selectedText}
                    setSelectedText={setSelectedText}
                    setFileModified={setFileModified}
                />
                <Editor
                    library={library}
                    setLibrary={setLibrary}
                    selectedText={selectedText}
                    setFileModified={setFileModified}
                />
                <Output output={displayText()} />
            </main>
            <footer>
                CURRENT LIBRARY {fileModified ? "MODIFIED" : "SAVED"}
            </footer>
            {newFileMode &&
                <NewOpenDialog
                    message={<>Warning! This library was modified.<br />
                        Do you want to save it before creating a new one?</>}
                    clickHandlerOne={handleSaveFileClick}
                    clickHandlerTwo={newFile}
                    clickHandlerThree={() => setNewFileMode(false)}
                />
            }
            {openFileMode &&
                <NewOpenDialog
                    message={<>Warning! This library was modified.<br />
                        Do you want to save it before opening another one?</>}
                    clickHandlerOne={handleSaveFileClick}
                    clickHandlerTwo={triggerInputFileClick}
                    clickHandlerThree={() => setOpenFileMode(false)}
                />
            }
        </>
    );
}

export default App;
