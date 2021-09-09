const AbstractBlock = require('./abstract-block');


class MathMultiply extends AbstractBlock {

    static title = "Multiply";
    static desc = "Multiplies 2 numbers";
    static menu = "Math/Multiply";

    constructor(props) {

        super(props);


        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput('AxB', 'number');


        this.resizable = true;

    }


    async onExecute() {

        const a = (parseFloat(this.getInputData(0)) || 0);
        const b = (parseFloat(this.getInputData(1)) || 0);

        this.setOutputData(0, a * b);
    }

}

module.exports = MathMultiply;

