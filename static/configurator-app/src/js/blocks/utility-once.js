const AbstractBlock = require('./abstract-block');
const debounce = require('debounce');

class Once extends AbstractBlock {

    static title = "Once Every";
    static desc = "Lets an event pass only once every set amount of time";
    static menu = "Flow Control/Once every";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addOutput('event', LiteGraph.EVENT);

        this.addProperty('locked', false);

        const me = this;

        this.addWidget('space');

        this.everyWidget = this.addWidget(
            "number",
            "Every",
            0,
            every => {
                this.properties['every'] = every;
            });

        this.everyUnitComboWidget = this.addWidget(
            "combo",
            "Unit",
            "seconds",
            value => this.properties['everyUnit'] = value,
            { values: ['seconds', 'minutes', 'hours', 'days']} );


        //this.lockWidget = this.addWidget("toggle", "Lock", false, value => this.properties['locked'] = value, {on: "yes", off: "no"});
        //this.lockWidget.disabled = true;

        this.addWidget(
            "button",
            "Reset",
            null,
            debounce(
                function (v) {
                    me.properties['locked'] = false;
                    //me.lockWidget.value = false;
                    me.properties.lastPass = 0;
                    me.info("Once cycle reset!");
                }
                , 1000, true), {});

    }


    onConfigure() {

        //this.lockWidget.value = this.properties['locked'];
        this.everyWidget.value = this.properties['every'] || 0;
        this.everyUnitComboWidget.value = this.properties['everyUnit'] || 'seconds';

    }


    async onAction(action, event) {

        const now = new Date().getTime();

        const m = this.properties.everyUnit === 'seconds' ? 1 :
            this.properties.everyUnit === 'minutes' ? 60 :
                this.properties.everyUnit === 'hours' ? 3600 :
                    this.properties.everyUnit === 'days' ? 86400 : 1;

        if(!this.properties.lastPass || !this.properties.every || (this.properties.lastPass + this.properties.every * m * 1000) < now) {

            this.properties.lastPass = now;
            this.properties['locked'] = true;
            this.triggerSlot(0, event);
            //this.lockWidget.value = true;
            console.log("Once accepted!");
        }
        else
            console.log("Once rejected!");



    }

}

module.exports = Once;

