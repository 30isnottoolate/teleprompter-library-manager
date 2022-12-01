import React, { useState } from 'react';
import './App.css';
import Editor from './Editor';

const App: React.FC = () => {
    const [library, setLibrary] = useState<{ texts: [{ title: string, content: string }] }>({ texts: [{ title: "My First Text", content: "" }] });

    return <Editor library={library} setLibrary={setLibrary} />
}

export default App;
