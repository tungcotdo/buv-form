function appendToHead(element){
    document.getElementsByTagName('head')[0].appendChild(element);
}

function setTitle(titleContent){
    let titleElement = document.createElement('title');
    titleElement.innerText = titleContent;
    appendToHead(titleElement);
}

export {setTitle}