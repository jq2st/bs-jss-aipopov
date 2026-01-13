(() => {

    const script = document.currentScript;
    const title = script.dataset.name;

    class MyPanel extends HTMLElement {

        #shadow; 
        #subHeader

        #subHeaderValue = ''

        static observedAttributes = ["header", "sub-header"];

        constructor(){
            super();
        }

        connectedCallback() {
            this.#shadow = this.attachShadow({ mode: "open" });
            this.#createTemplate();

            this.#subHeader = this.#shadow.querySelector(".panel-subheader");
            this.#setSubheader();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "sub-header") {
                this.#subHeaderValue = newValue;
                this.#setSubheader();
            }
        }

        #setSubheader() {
            if (this.#subHeader) {
                this.#subHeader.textContent = this.#subHeaderValue;
            }
        }

        #createTemplate() {
            const template = document.createElement("template");
            template.innerHTML = `

                <div class="panel">
                    <div class="panel-header">
                        <slot name="header"></slot>
                    </div>
                    <p class="panel-subheader"></p>
                    <div class="panel-content">
                        <slot></slot>
                    </div>
                </div>

                <style>
                    :host {
                        --my-panel-border-color: #e2e8f0;
                        --my-panel-border-radius: 6px;
                        --my-panel-content-padding: 0 1.125rem 1.125rem 1.125rem;
                        --my-panel-header-padding: 1.125rem;
                        --my-panel-subheader-padding: 0rem 1.125rem 2rem;
                        --my-panel-title-font-weight: 600;
                    }
                    .panel {
                        border: 1px solid var(--my-panel-border-color);
                        border-radius: var(--my-panel-border-radius);
                    }
                    .panel-header {
                        padding: var(--my-panel-header-padding);
                        font-weight: var(--my-panel-title-font-weight);
                    }
                    .panel-subheader {
                        margin: 0;
                        padding: var(--my-panel-subheader-padding);
                    }
                    .panel-content {
                        padding: var(--my-panel-content-padding);
                    }
                </style>
            `;

            this.#shadow.append(template.content.cloneNode(true));
        }

    }

    customElements.define(title, MyPanel);

})()