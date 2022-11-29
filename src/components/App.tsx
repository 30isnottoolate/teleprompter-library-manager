import React, { useState } from 'react';
import './App.css';
import Startup from './Startup';
import Editor from './Editor';

const App: React.FC = () => {
    const [mode, setMode] = useState("start"); // start, new, open
    const [library, setLibrary] = useState("");

    if (mode === "start") {
        return <Startup />
    } else if (mode === "new") return <Editor />
    else return <Editor />;


}

export default App;
