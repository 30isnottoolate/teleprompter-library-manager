const typeSafeProp = (library: { texts: [{ title: string, content: string }] },
    index: number, prop: string) => {

    if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
        return library.texts[index][prop];
    } else return "";
}

const insertText = (text: string) => {
    const selection = document.getSelection();

    if (selection && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);

        range.deleteContents();
        range.insertNode(textNode);
        range.selectNode(textNode);
        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

const ancestorNode = (node: Node) => {
    let nodeToReturn = node;

    const ancestorFinder = (node: Node) => {
        if (node.parentNode && node.parentNode.nodeName !== "DIV" &&
            node.parentElement && node.parentElement.id !== "editor-box") {

            ancestorFinder(node.parentNode);
        } else nodeToReturn = node;
    }

    ancestorFinder(node);

    return nodeToReturn;
}

export default { typeSafeProp, insertText, ancestorNode };
