const typeSafeProp = (library: { texts: [{ title: string, content: string }] },
    index: number, prop: string) => {
        
    if (library && library.texts && library.texts[index] && library.texts[index][prop]) {
        return library.texts[index][prop];
    } else return "";
}

export default typeSafeProp;
