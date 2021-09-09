const AbstractBlock = require('./abstract-block');


class LogEvent extends AbstractBlock {

    static title = "Probe value";
    static desc = "Shows the constant value on input";
    static menu = "Debug/Probe";

    constructor() {
        super();

        this.addInput("value", 0);

        this.widget = this.addWidget(
            "text",
            "Value",
            "",
            value => {
            });

        this.widget.disabled = false;

    }


    onExecute() {
        this.widget.value = this.getInputData(0);
    }

}


module.exports = LogEvent;