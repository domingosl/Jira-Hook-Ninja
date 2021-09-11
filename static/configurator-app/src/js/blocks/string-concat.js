const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


class StringConcat extends AbstractBlock {

    static title = "Concat";
    static desc = "Concatenates 2 strings";
    static menu = "String/Concat";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('String A', 'string');
        this.addInput('String B', 'string');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('A + B', 'string');

        this.resizable = true;


    }

    onAction(action, event) {

        this.setOutputData(1, String(this.getInputData(1)).concat(String(this.getInputData(2))));
        this.triggerSlot(0, event);
    }

}

module.exports = StringConcat;