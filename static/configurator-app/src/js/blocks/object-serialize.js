const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


class StringJsonParse extends AbstractBlock {

    static title = "Object Serialize";
    static desc = "Takes a input object and outputs a serialized string";
    static menu = "Object/Serialize";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('Object', 'object');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('String', 'string');

        this.resizable = true;


    }

    onAction(action, event) {


        let output;

        try {
            output = JSON.stringify(this.getInputData(1)) || "";
        }
        catch (e) {
            return this.error("Cannot serialize input object, is not a valid object.");
        }

        this.setOutputData(1, output);
        this.triggerSlot(0, event);
    }

}

module.exports = StringJsonParse;