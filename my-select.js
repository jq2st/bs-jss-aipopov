const script = document.currentScript;
const title = script.dataset.name;

class MySelect extends HTMLElement {

    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;

    constructor(){
        super();
    }

    connectedCallback(){
        this.#createTemplate();
        this.#renderOptions();
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <button class="select-button"></button>

            <div class="select-popup">
                <input placeholder="Search..."/>
                <div class="select-popup-options"></div>
            </div>
        `;

        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector(".select-button");
        this.#selectPopup = this.querySelector(".select-popup");
        this.#selectPopupSearch = this.querySelector(".select-popup-search");
        this.#optionsBox = this.querySelector(".select-popup-options");
    }

    #renderOptions() {
        const optionElements = Array.from(this.querySelectorAll("option"));
        const options = optionElements.map(opt => ({
            value: opt.value,
            text: opt.textContent
        }));
        optionElements.forEach(element => element.remove());
        const optionsBox = this.#optionsBox
        optionsBox.innerHTML = ''
        const template = document.createElement("template");
        template.innerHTML = `
            <label class="option">
                <input type="checkbox"/>
                <span class="label-text"></span>
            </label>
        `;
        options.forEach(({ value, text }) => {
            const node = template.content.cloneNode(true);
            const label = node.querySelector(".option");
            const span  = node.querySelector(".label-text");
            label.dataset.value = value;
            span.textContent = text;
            optionsBox.appendChild(node);
        });
    }
}

customElements.define(title, MySelect);