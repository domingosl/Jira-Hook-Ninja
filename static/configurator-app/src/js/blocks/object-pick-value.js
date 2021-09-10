const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


class ObjectPickValue extends AbstractBlock {

    static title = "Object Pick Value";
    static desc = "Picks a value from an object given a Key";
    static menu = "Object/Pick Value";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('Object', 'object');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('value', 0);


        this.addProperty('key', "");


        this.addWidget("space");

        this.keyWidget = this.addWidget(
            "string",
            "Key",
            "",
            key => {
                this.properties['key'] = key;
            });

        this.resizable = true;


    }


    onAction(action, event) {


        this.setOutputData(1, this.getInputData(1)[this.properties.key]);
        this.triggerSlot(0, event);
    }

}

module.exports = ObjectPickValue;