import React, { useState } from 'react';
import './App.css';
import Startup from './Startup';
import Editor from './Editor';

const App: React.FC = () => {
    const [mode, setMode] = useState("start"); // start, edit
    const [library, setLibrary] = useState<{ texts: [{ title: string, content: string }] }>({ texts: [{ title: "My First Text", content: "" }] });

    if (mode === "start") {
        return <Startup setLibrary={setLibrary} setMode={setMode} />
    } else return <Editor library={library} setLibrary={setLibrary} />
}

export default App;
