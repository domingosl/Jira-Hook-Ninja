const AbstractBlock = require('./abstract-block');


class MathSubtract extends AbstractBlock {

    static title = "Subtract";
    static desc = "Subtracts 2 numbers";
    static menu = "Math/Subtract";

    constructor(props) {

        super(props);


        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput('A-B', 'number');


        this.resizable = true;

    }


    async onExecute() {

        const a = (parseFloat(this.getInputData(0)) || 0);
        const b = (parseFloat(this.getInputData(1)) || 0);

        this.setOutputData(0, a - b);
    }

}

module.exports = MathSubtract;

