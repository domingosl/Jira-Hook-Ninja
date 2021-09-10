const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


class StringJsonParse extends AbstractBlock {

    static title = "JSON Parse";
    static desc = "Takes a input text and try to parse it as JSON";
    static menu = "String/JSON parse";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('String', 'string');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('Obj', 'object');

        this.resizable = true;


    }

    onAction(action, event) {


        let obj;

        try {
            obj = JSON.parse(this.getInputData(1)) || "{}";
        }
        catch (e) {
            return this.error("Cannot parse input string, is not a valid JSON string.");
        }

        this.setOutputData(1, obj);
        this.triggerSlot(0, event);
    }

}

module.exports = StringJsonParse;