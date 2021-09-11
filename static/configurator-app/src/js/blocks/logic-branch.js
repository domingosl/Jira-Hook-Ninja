const LiteGraph = require('../litegraph');
const AbstractBlock = require('./abstract-block');

class Branch extends AbstractBlock {

    static title = "Branch";
    static desc = "Branches the output if a condition match";
    static menu = "Flow Control/Branch";

    constructor() {

        super();


        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('A', 0);
        this.addInput('B', 0);

        this.addOutput('true', LiteGraph.EVENT);
        this.addOutput('false', LiteGraph.EVENT);

        this.addProperty('operator', "A equals B");


        this.addWidget("space");


        this.operatorComboWidget = this.addWidget(
            "combo",
            "",
            "A equals B",
            selectedOperator => this.properties['operator'] = selectedOperator,
            { values: ['A equals B', 'A lower than B', 'A greater than B', 'A is greater than or equal to B', 'A is lower than or equal B', 'A is contained in B']} );


        this.size = [280, 130];
    }


    async onAction (action, event) {

        await this.yield();

        const a = this.getInputData(1);
        const b = this.getInputData(2);


        if(this.properties.operator === 'A equals B' && a === b)
            this.triggerSlot(0, event);
        else if(this.properties.operator === 'A lower than B' && parseFloat(a) < parseFloat(b))
            this.triggerSlot(0, event);
        else if(this.properties.operator === 'A greater than B' && parseFloat(a) > parseFloat(b))
            this.triggerSlot(0, event);
        else if(this.properties.operator === 'A is greater than or equal to B' && parseFloat(a) >= parseFloat(b))
            this.triggerSlot(0, event);
        else if(this.properties.operator === 'A is lower than or equal B' && parseFloat(a) <= parseFloat(b))
            this.triggerSlot(0, event);
        else if(this.properties.operator === 'A is contained in B' && String(a).includes(b))
            this.triggerSlot(0, event);
        else
            this.triggerSlot(1, event);

    }

    onConfigure() {

        this.operatorComboWidget.value = this.properties['operator'] ? this.properties['operator'] : "A equals B";

    }


}

module.exports = Branch;