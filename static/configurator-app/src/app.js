import { invoke } from '@forge/bridge';
const LiteGraph = require('./js/litegraph');
const Blocks = require('./js/blocks');
const blockingLoader = require('./js/blocking-loader');
const toast = require('./js/toast');
const newFlowModal = require('./js/modals/create-flow');
const confirmDialogModal = require('./js/modals/confirm-dialog');
const selectFlowModal = require('./js/modals/select-flow');

const apiClient = require('../../../common/api-client');
LiteGraph.saveFlow = async () => {

    if(!graph.currentFlow || !graph.currentFlow.id)
        graph.currentFlow = {
            id: new Date().getTime(),
            name: null
        }

    if(!graph.currentFlow.name)
        graph.currentFlow.name = await newFlowModal.show() || 'Unnamed flow';

    blockingLoader.show();

    await invoke('saveFlow', { id: graph.currentFlow.id, name: graph.currentFlow.name, data: graph.serialize() });
    blockingLoader.hide();
    toast("success", "Flow saved!");

};

LiteGraph.newFlow = async () => {

    const name = await newFlowModal.show();

    if(!name)
        return;

    graph.currentFlow = {
        id: new Date().getTime(),
        name
    };

    flowTitle.innerText = name;
    graph.configure({});

};

LiteGraph.deleteFlow = async () => {

    await confirmDialogModal.show(async () => {
        blockingLoader.show();
        await invoke('deleteFlow', { id: graph.currentFlow.id });
        graph.currentFlow = null;
        flowTitle.innerText = '';
        graph.configure({});
        blockingLoader.hide();
    });

};

LiteGraph.openFlow = async () => {

    blockingLoader.show();
    const storedFlows = (await invoke('listFlows')).results;
    blockingLoader.hide();

    if(storedFlows.length <= 0)
        return toast('info', 'You dont have any flows yet, try saving your first one');

    await selectFlowModal.show(storedFlows.reduce((result, flow) => {
        result[flow.key] = flow.value.name;
        return result;
    },{}), (selectedFlow) => {

        if(!selectedFlow)
            return;

        const flow = storedFlows.find(f => f.key === selectedFlow);

        graph.currentFlow = { id: flow.key.replace('flow_', ''), name: flow.value.name };
        flowTitle.innerText = flow.value.name;

        graph.configure(flow.value.data);

    });


}

apiClient.setResolver(async (endpoint, method, payload) =>
    await invoke('jiraApiCall', { endpoint, method, payload }));

const flowTitle = document.getElementById('flow-title');

let graph;


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

    const storedFlows = (await invoke('listFlows')).results;

    console.log("Stored flows", storedFlows);

    if(storedFlows.length > 0) {
        //await invoke('deleteFlow', { id: storedFlows[0].key.replace('flow_', '')});

        graph.currentFlow = { id: storedFlows[0].key.replace('flow_', ''), name: storedFlows[0].value.name };

        storedFlows
            .sort((a, b) => (a.value.saveAt > b.value.saveAt) ? -1 : ((b.value.saveAt > a.value.saveAt) ? 1 : 0))
        graph.configure(storedFlows[0].value.data);

        flowTitle.innerText = storedFlows[0].value.name;
        blockingLoader.hide();

    } else {
        blockingLoader.hide();
        graph.currentFlow = { id: new Date().getTime(), name: await newFlowModal.show() || 'Unnamed flow' }
    }


    setTimeout(()=>canvas.resize(), 10);
    graph.start();


}

run();