(() => {

    const script = document.currentScript;
    const title = script.dataset.name;

    class MySelect extends HTMLElement {

        #value = '';

        #selectButton;
        #selectPopup;
        #selectPopupSearch;
        #optionsBox;
        #shadow; 

        #options;

        constructor(){
            super();
        }

        connectedCallback() {
            this.#shadow = this.attachShadow({ mode: "open" });
            this.#createTemplate();
            this.#calculateOptions();
            this.#renderOptions();
            this.#addListeners();
        }

        #createTemplate() {
            const template = document.createElement("template");
            template.innerHTML = `
                <button class="select-button">Выбрать</button>

                <div class="select-popup">
                    <slot name="search">
                        <input class="select-popup-search" placeholder="Search..."/>
                    </slot>

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
                    .select-popup-options .option[filtered="true"] {
                        display: none;
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

        #calculateOptions() {
            const optionElements = Array.from(this.querySelectorAll("option"));
            this.#options = optionElements.map(opt => ({
                value: opt.value,
                text: opt.textContent
            }));
            optionElements.forEach(element => element.remove());
        }

        #renderOptions() {
            const optionsBox = this.#optionsBox
            optionsBox.innerHTML = ''
            const template = document.createElement("template");
            template.innerHTML = `
                <label class="option">
                    <input type="checkbox"/>
                    <span class="label-text"></span>
                </label>
            `;
            this.#options.forEach(({ value, text }) => {
                const node = template.content.cloneNode(true);
                const label = node.querySelector(".option");
                const span = node.querySelector(".label-text");
                label.dataset.value = value;
                span.textContent = text;
                optionsBox.appendChild(node);
            });
        }

        #addListeners() {
            this.#selectButton.addEventListener('click', () => 
                this.#togglePopup()
            )
            this.#selectPopupSearch.addEventListener('input', () => 
                this.#search()
            )
            this.#selectPopup.addEventListener('change', (e) => 
                this.#onSelectionChange(e)
            )
            document.addEventListener('click', (e) => {
                if (!this.contains(e.target) && !this.#shadow.contains(e.target)) {
                    this.#togglePopup()
                }
            });
        }

        #togglePopup() {
            this.#selectPopup.classList.toggle("open");
        }

        #search() {
            const value = this.#selectPopupSearch.value;
            this.#options.forEach(option => {
                const optionValue = option.value;
                const optionText = option.text;
                const isIncuded = optionText.toLowerCase().includes(value.toLowerCase());
                const select = this.#optionsBox.querySelector(`[data-value="${optionValue}"]`);
                select.setAttribute('filtered', !isIncuded);
            })
        }

        #onSelectionChange(e) {
            if (e.target.type !== 'checkbox') return;
            this.#updateValue();
        }

        #updateValue() {
            const checked = this.#selectPopup.querySelectorAll(
                '.option input[type="checkbox"]:checked'
            );
            const values = Array.from(checked).map(cb =>
                cb.closest('.option').dataset.value
            );
            const value = values.join(',');
            this.#value = value
            this.dataset.value = value;
        }

        get value() {
            return this.#value;
        }
    }

    customElements.define(title, MySelect);

})()