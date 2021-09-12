const AbstractBlock = require('./abstract-block');
const debounce = require('debounce');

class UtilityCount extends AbstractBlock {

    static title = "Count";
    static desc = "Counts the number of times the block gets triggered and reset the counter after an specified time";
    static menu = "Utility/Count";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('counter', 'number');

        this.addProperty('counter', 0);

        const me = this;

        this.addWidget('space');

        this.resetWidget = this.addWidget(
            "number",
            "Reset in",
            0,
            val => {
                this.properties['reset'] = val;
            });

        this.resetUnitComboWidget = this.addWidget(
            "combo",
            "Unit",
            "seconds",
            value => this.properties['resetUnit'] = value,
            { values: ['seconds', 'minutes', 'hours', 'days']} );


        this.addWidget(
            "button",
            "Reset counter",
            null,
            debounce(
                function (v) {
                    me.properties.counter = 0;
                    me.properties.firstHit = null;
                    me.info("Counter reset!");
                }
                , 1000, true), {});

    }


    onConfigure() {

        this.resetWidget.value = this.properties['reset'] || 0;
        this.resetUnitComboWidget.value = this.properties['resetUnit'] || 'seconds';

    }


    async onAction(action, event) {


        if(this.properties.counter === 0)
            this.properties.firstHit = new Date().getTime();

        this.properties.counter++;
        this.setOutputData(1, this.properties.counter);

        this.triggerSlot(0, event);
        console.log("Counter", this.properties.counter);


    }

    onExecute() {

        if(!this.properties.firstHit || !this.properties.reset)
            return;

        const now = new Date().getTime();

        const m = this.properties.resetUnit === 'seconds' ? 1 :
            this.properties.resetUnit === 'minutes' ? 60 :
                this.properties.resetUnit === 'hours' ? 3600 :
                    this.properties.resetUnit === 'days' ? 86400 : 1;


        if((this.properties.firstHit + m * this.properties.reset * 1000) <= now)
            this.properties.counter = 0;


    }

}

module.exports = UtilityCount;

