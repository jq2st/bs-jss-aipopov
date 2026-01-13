const script = document.currentScript;
const title = script.dataset.name;

class MySelect extends HTMLElement {

    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #shadow 

    constructor(){
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#createTemplate();
        this.#renderOptions();
        this.#addListeners();
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <button class="select-button">Выбрать</button>

            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..."/>
                <div class="select-popup-options"></div>
            </div>

            <style>
                :host {
                    position: relative;
                    display: inline-block;
                }
                .select-popup {
                    margin-top: 8px;
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    padding: 5px 0px;
                    background: var(--select-popup-background, white);
                    box-shadow: var(--select-popup-shadow, 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1));
                    border-radius: 8px;
                }
                .select-popup.open{
                    display: block;
                }
                .select-popup-search {
                    margin: 0 8px;
                    height: 30px;
                    padding: 0 5px;
                    border-radius: 10px;
                    border: 1px solid #cbd5e1;
                    outline: none;
                }
                .select-popup-search:hover {
                    border: 1px solid #94a3b8;
                }
                .select-button {
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .select-popup-options {
                    margin-top: 15px;
                    display: flex;
                    flex-direction: column;
                }
                .select-popup-options .option {
                    padding: 8px;
                    font-size: 18px;
                    cursor: pointer;
                    user-select: none;
                }
                .select-popup-options .option:hover {
                    background-color: #cbd5e1
                }
            </style>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector(".select-button");
        this.#selectPopup = this.#shadow.querySelector(".select-popup");
        this.#selectPopupSearch = this.#shadow.querySelector(".select-popup-search");
        this.#optionsBox = this.#shadow.querySelector(".select-popup-options");
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

    #addListeners() {
        this.#selectButton.addEventListener('click', () => 
            this.#togglePopup()
        )
    }

    #togglePopup() {
        this.#selectPopup.classList.toggle("open");
    }
}

customElements.define(title, MySelect);