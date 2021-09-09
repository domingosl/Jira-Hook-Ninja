const AbstractBlock = require('./abstract-block');
const debounce = require('debounce');

class Once extends AbstractBlock {

    static title = "Once";
    static desc = "Lets an event pass only once";
    static menu = "Flow Control/Once";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addOutput('trigger', LiteGraph.EVENT);

        this.addProperty('activated', false);

        const me = this;

        this.addWidget('space');

        this.activatedWidget = this.addWidget("toggle", "Activated", false, value => this.properties['activated'] = value, {on: "yes", off: "no"});

        this.activatedWidget.disabled = true;



        this.addWidget(
            "button",
            "Reset",
            null,
            debounce(
                function (v) {
                    me.properties['activated'] = false;
                    me.activatedWidget.value = false
                }
                , 1000, true), {});

    }


    onConfigure() {

        this.activatedWidget.value = this.properties['activated'];

    }


    async onAction(action, event) {

        if(!this.properties['activated'])
            this.triggerSlot(0, event);

        this.properties['activated'] = true;
        this.activatedWidget.value = true;

    }

}

module.exports = Once;

