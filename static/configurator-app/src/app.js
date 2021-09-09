import { invoke } from '@forge/bridge';
const LiteGraph = require('./js/litegraph');
const Blocks = require('./js/blocks');
const blockingLoader = require('./js/blocking-loader');
const toast = require('./js/toast');


const apiClient = require('../../../common/api-client');


apiClient.setResolver(async (endpoint, method, payload) =>
    await invoke('jiraApiCall', { endpoint, method, payload }));


let  graph;


const saveBtn = document.querySelector('#save-btn');

saveBtn.addEventListener('click', async () => {

    blockingLoader.show();
    await invoke('saveFlow', graph.serialize());
    blockingLoader.hide();
    toast("success", "Flow saved!");

});

async function run() {

    blockingLoader.show();

    graph = new LGraph(null, apiClient, toast);
    await graph.loadJiraSpecifics();

    graph.jiraSpecifics.webtriggerURL = await invoke('getWebhookURL');

    const canvas = new LGraphCanvas("#editor", graph);

    LiteGraph.allow_scripts = false;
    canvas.show_info = false;
    canvas.allow_searchbox = false;

    graph.onAfterExecute = function() {
        canvas.draw(true);
    };

    window.addEventListener("resize", function() {canvas.resize(); } );

    LiteGraph.registerNodes(Blocks);

    const flowData = await invoke('loadFlow');
    graph.configure(flowData);

    blockingLoader.hide();
    setTimeout(()=>canvas.resize(), 10);
    graph.start();


}

run();