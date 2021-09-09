const LiteGraph = require('../litegraph');
const AbstractBlock = require('./abstract-block');


class NetworkIncomingWebhook extends AbstractBlock {

    static title = "Web trigger";
    static desc = "Allows to receive a webhook at the indicated URL.";

    static menu = "Jira/Webtrigger";


    constructor(props) {

        super(props);

        const rand = new Date().getTime();

        this.uuid = "urlbox-" + rand;

        this.addOutput('trigger', LiteGraph.EVENT);
        this.addOutput('body (string)', 'string');
        this.addOutput('method (string)', 'string');
        this.addOutput('headers (object)', 'string');

        this.resizable = true;


    }

    async onAdded() {

        this.myId = new Date().getTime();
        //this.graph.remove(this);

        //require('../../clients_src/app/js/modals/abstract').Toast("warning", "Only one Incoming Webhook block can be added by flow", 5000);

    }

    onConfigure() {

        if(!this.properties.myId)
            this.properties.myId = this.myId;
        else
            this.myId = this.properties.myId;

        this.properties.url = this.graph.jiraSpecifics.webtriggerURL + "?r=" + this.properties.myId;


        //Running on BE
        if(typeof document === 'undefined')
            return;

        const el = document.getElementById(this.uuid);

        if(!el)
            return;

        el.value = this.properties.url;
    }

    triggerEvent(slot = 0, body, method, headers) {

        this.setOutputData(1, body);
        this.setOutputData(2, method);
        this.setOutputData(3, headers);
        this.triggerSlot(slot, { eventType: "incomingWebhook", timestamp: new Date().getTime() });

    }

    onShowCustomPanelInfo(panel) {

        if(!this.properties.myId) {
            this.properties.url = this.graph.jiraSpecifics.webtriggerURL + "?r=" + this.myId;
            this.properties.myId = this.myId;
        }

        panel.addHTML("<h3>URL</h3><input type='text' id=\""
            + this.uuid + "\" value='"
            + (this.properties.url)
            + "' readonly></input>");

    }


}

module.exports = NetworkIncomingWebhook;

