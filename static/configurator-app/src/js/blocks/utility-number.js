const AbstractBlock = require('./abstract-block');


class Number extends AbstractBlock {

    static title = "Number";
    static desc = "Outputs a number";
    static menu = "Constant/Number";

    constructor(props) {

        super(props);


        this.addOutput('number', 'number');

        this.addProperty('number', 0);


        this.resizable = true;

        this.addWidget("space");

        this.numberWidget = this.addWidget(
            "number",
            "Number",
            0,
            value => { this.properties['number'] = value });

    }


    onConfigure() {

        this.numberWidget.value = this.properties['number']  ? this.properties['number'] : 0;

    }


    async onExecute() {
        this.setOutputData(0, parseFloat(this.properties['number']).toFixed(2));
    }

}

module.exports = Number;

