class BlockingLoader {

    constructor() {

        const loaderEl = document.getElementById('blocking-loader');
        if(loaderEl)
            return;

        //<div id="blocking-loader" class="loader-wrapper"><div class="loader-spinner"></div></div>
        const el = document.createElement("div");
        el.id = "blocking-loader";
        el.classList.add("loader-wrapper");
        el.style.display = "none";

        const iEl = document.createElement("div");
        iEl.classList.add("loader-spinner");

        el.append(iEl);

        document.body.append(el);

        this.el = el;

    }

    show() {
        this.el.style.display = "block";
    }

    hide() {
        this.el.style.display = "none";
    }

}

module.exports = new BlockingLoader();