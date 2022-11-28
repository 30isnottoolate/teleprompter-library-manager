import React, { useState } from 'react';
import './App.css';
import Editor from './Editor';

const App: React.FC = () => {
    const [inputText, setInputText] = useState("");

    return (
        <>
            <Editor />
        </>
    )
}

export default App;
