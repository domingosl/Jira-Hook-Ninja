const AbstractBlock = require('./abstract-block');


class MathDivide extends AbstractBlock {

    static title = "Divide";
    static desc = "Divides 2 numbers";
    static menu = "Math/Divide";

    constructor(props) {

        super(props);


        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput('A/B', 'number');


        this.resizable = true;

    }


    async onExecute() {

        const a = (parseFloat(this.getInputData(0)) || 0);
        const b = (parseFloat(this.getInputData(1)) || 0);

        this.setOutputData(0, a / b);
    }

}

module.exports = MathDivide;

