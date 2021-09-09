const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


class UtilityStringTemplate extends AbstractBlock {

    static title = "Text template";
    static desc = "Given a text and a object, the block will replace occurrences of the object keys in the text surrounded by {}\n" +
        "For example: Obj { foo: \"world\" } and Text \"Hello {foo}\", will output \"Hello world\"";
    static menu = "Utility/String Template";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('object', 'object');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('string', 'string');

        this.addProperty('string', "");


        this.resizable = true;

        this.addWidget("space");

        this.textWidget = this.addWidget(
            "text",
            "Template",
            "",
            value => { this.properties['string'] = value }, { multiline:true });

    }


    onConfigure() {

        this.textWidget.value = this.properties['string']  ? this.properties['string'] : "";

    }

    async onAction(action, event) {


        const tplObj = this.getInputData(1) || {};

        if(typeof tplObj !== 'object')
            return this.error('The template cannot be applied, check Tpl Obj input');


        this.setOutputData(1, this.doTemplate(this.properties['string'], tplObj));
        this.triggerSlot(0, event);
    }

    doTemplate(text, obj = {}) {
        return text.replace(/{(\w+)}/g, function (_, k) {
            return obj[k];
        });
    }

}

module.exports = UtilityStringTemplate;