import React, { ChangeEventHandler, MouseEventHandler, RefObject } from 'react';
import Icon from './Icon';

interface MenuProps {
    handleNewFileClick: MouseEventHandler,
    handleOpenFileClick: MouseEventHandler,
    handleSaveFileClick: MouseEventHandler,
    openFile: ChangeEventHandler
    inputFileRef: RefObject<HTMLInputElement>
}

const Menu: React.FC<MenuProps> = ({ handleNewFileClick, handleOpenFileClick, handleSaveFileClick, openFile, inputFileRef}) => {
    return (
        <div id="menu">
            <div className="toolbar">
                <Icon
                    icon={"newFile"}
                    size={30} viewBox="2 0 12 16"
                    clickHandler={handleNewFileClick}
                />
                <Icon
                    icon={"openFile"}
                    size={30} viewBox="0 2 16 13"
                    clickHandler={handleOpenFileClick}
                />
                <Icon
                    icon={"saveFile"}
                    size={30}
                    clickHandler={handleSaveFileClick}
                />
                <input
                    ref={inputFileRef}
                    onChange={openFile}
                    accept=".json"
                    style={{ display: "none" }}
                    type="file"
                    name="filename"
                />
            </div>
        </div>
    );
}

export default Menu;