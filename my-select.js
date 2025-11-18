const script = document.currentScript;
const title = script.dataset.name;

class MySelect extends HTMLElement {
    constructor(){
        super();
        console.log(title)
    }
}

customElements.define(title, MySelect);