$(".typewriter").each(function() {
    console.log(this);
    this.style.setProperty("--blinkSpeed", this.getAttribute("blink") + "s")
    if (this.hasAttribute("blinkDelay")) this.style.setProperty("--blinkDelay", this.getAttribute("blinkDelay") + "s")
    let text = this.innerText;
    let chars = text.length;
    console.log(this.innerText);
    this.innerText = "\u200b";
    setTimeout(() => {
        function _(ele) {
            if (waiting) {
                waiting--;
                return
            }
            if (i > chars) {
                clearInterval(interval);
                return;
            }
            const c = text.charAt(i)
            ele.innerText += text.charAt(i) + (c == ' ' ? "\u200b" : "");
            if (c == ".") waiting = 1;
            i++;
        }

        let waiting = 0;
        let i = 0;
        let interval = setInterval(_, this.getAttribute("speed") * 1000, this)
        _(this);
    }, this.getAttribute("delay") * 1000)
})