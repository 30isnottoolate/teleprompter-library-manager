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
                    width={23} height={30} viewBox="2 0 12 16"
                    clickHandler={handleNewFileClick}
                    tooltipText={"New File"}
                    tooltipCentered={false}
                />
                <Icon
                    icon={"openFile"}
                    width={36} height={30} viewBox="0 2 16 13"
                    clickHandler={handleOpenFileClick}
                    tooltipText={"Open File"}
                    tooltipCentered={true}
                />
                <Icon
                    icon={"saveFile"}
                    height={30}
                    clickHandler={handleSaveFileClick}
                    tooltipText={"Save File"}
                    tooltipCentered={true}
                />
                <input
                    ref={inputFileRef}
                    onChange={openFile}
                    accept=".json"
                    style={{ display: "none" }}
                    type="file"
                />
            </div>
        </div>
    );
}

export default Menu;
