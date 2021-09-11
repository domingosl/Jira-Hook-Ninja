const AbstractBlock = require('./abstract-block');


class UtilityString extends AbstractBlock {

    static title = "String";
    static desc = "Outputs a string";
    static menu = "Constant/String";

    constructor(props) {

        super(props);


        this.addOutput('String', 'string');

        this.addProperty('string', "");


        this.resizable = true;

        this.addWidget("space");

        this.stringWidget = this.addWidget(
            "string",
            "String",
            "",
            value => {
                this.properties['string'] = value;
                this.setOutputData(0, this.properties['string'])
            });

    }


    onExecute() {

        this.stringWidget.value = this.properties['string']  ? this.properties['string'] : "";
        this.setOutputData(0, this.properties['string']);

    }

}

module.exports = UtilityString;