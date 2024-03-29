const typeSafeProp = (library: { texts: { title: string, content: string }[], librarian: string },
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
            node.parentElement && node.parentElement.id !== "content-input") {

            ancestorFinder(node.parentNode);
        } else nodeToReturn = node;
    }

    ancestorFinder(node);

    return nodeToReturn;
}

const removeChildlessNodes = (node: Node) => {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(childNode => {
            if (!childNode.hasChildNodes() &&
                childNode.nodeName !== "#text" && childNode.nodeName !== "BR") {
                node.removeChild(childNode);
                removeChildlessNodes(node);
            } else {
                removeChildlessNodes(childNode);
            }
        });
    }
}

const removeStyleTag = (node: Node | ChildNode | DocumentFragment, tag: string) => {
    if (node.hasChildNodes()) {

        node.childNodes.forEach((childNode) => {
            if (childNode.nodeName === tag && childNode.hasChildNodes()) {
                childNode.replaceWith(...childNode.childNodes);
                removeStyleTag(node, tag);
            } else if (childNode.nodeName === tag && !childNode.hasChildNodes()) {
                node.removeChild(childNode);
                removeStyleTag(node, tag);
            } else if (childNode.hasChildNodes()) {
                removeStyleTag(childNode, tag);
            }
        });
    }
}

export { typeSafeProp, insertText, ancestorNode, removeChildlessNodes, removeStyleTag };
