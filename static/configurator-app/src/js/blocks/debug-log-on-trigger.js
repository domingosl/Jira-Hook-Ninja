const LiteGraph = require('../litegraph');
const AbstractBlock = require('./abstract-block');


class LogEvent extends AbstractBlock {

    static title = "Log on trigger";
    static desc = "Logs events on trigger";
    static menu = "Debug/Log on trigger";

    constructor() {
        super();

        this.uuid = "logbox-" + Math.floor(Math.random() * 999999999);

        this.addInput("trigger", LiteGraph.ACTION);
        this.addInput("value", 0);

    }


    onAction(action, param) {

        const data =  this.getInputData(1);
        console.log("Log event on trigger", data);

        //Running on BE
        if(typeof document === 'undefined')
            return;



        const el = document.getElementById(this.uuid);

        if(!el)
            return;

        el.value += JSON.stringify(data) + "\n";

        el.scrollTop = el.scrollHeight;
    };

    onShowCustomPanelInfo(panel) {

        panel.addHTML("<h3>Events logs</h3><textarea id=\"" + this.uuid + "\" readonly></textarea>");

    }


}


module.exports = LogEvent;