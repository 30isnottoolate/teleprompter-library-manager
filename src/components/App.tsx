import React, { useState } from 'react';
import './App.css';
import Startup from './Startup';
import Editor from './Editor';

const App: React.FC = () => {
    const [mode, setMode] = useState("start"); // start, new, open
    const [library, setLibrary] = useState(null);

    if (mode === "start") {
        return <Startup setLibrary={setLibrary} setMode={setMode} />
    } else if (mode === "new") return <Editor />
    else return <Editor />;


}

export default App;
