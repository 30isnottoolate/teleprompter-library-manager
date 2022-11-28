import React from 'react';

const App: React.FC = () => {
    return (
        <>
            <div id="text-input-container">
                <textarea />
            </div>
            <div id="text-select-container">
                <select id="texts" name="texts" size={3}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div id="text-display-container" />
        </>
    )
}

export default App;
