class InputSwitchElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.name = this.getAttribute("name");
        this.defValue = this.hasAttribute("value") ? this.getAttribute("value") : "false";

        this.setAttribute("tabindex", "0");
        this.innerHTML = `
        <input type="hidden" name="${this.name}" value="${this.defValue}">
        <span>`
        this.valueNode = this.children[0];
        this.spanNode = this.children[1];
        if (this.defValue != "false" && this.defValue != "true") {
            this.spanNode.classList.add("indeterminate")
        } else if (this.defValue == "true") {
            this.spanNode.classList.add("active")
        }
        this.addEventListener("click", this.select)
        this.addEventListener("keypress", this.keyPress)
    }

    select(e) {
        this.spanNode.classList.toggle("active")
        this.spanNode.classList.remove("indeterminate")
        this.valueNode.setAttribute("value", this.spanNode.classList.contains("active"));
    }

    keyPress(e) {
        if (e.keyCode === 32 || e.keyCode === 13) {
            this.select(e)
        }
    }
}

function clamp(a, min, max) {
    return Math.min(Math.max(a, min), max);
}

customElements.define("input-switch", InputSwitchElement);