import Resolver from '@forge/resolver';
import api, {webTrigger, storage, route} from "@forge/api";
const LiteGraph = require('../static/configurator-app/src/js/litegraph');


const apiClient = require('../common/api-client');
apiClient.setResolver(async (endpoint, method, payload)=>{

    const apiRequest = {
        method: method.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if(payload)
        apiRequest.body = JSON.stringify(payload);

    return await (await api.asApp().requestJira(route(endpoint), apiRequest)).json();

});

const resolver = new Resolver();


const wait = async (time) => new Promise(resolve => setTimeout(resolve, time));

const waitForCompletion = async (graph, iteration = 1) => {

    if(iteration >= 10)
        return Promise.reject('timeout');

    await wait(1000);

    if(graph.apiClient.runningRequests === 0)
        return Promise.resolve();

    return waitForCompletion(graph, iteration + 1);

};

resolver.define('saveFlow', async (req) => {

    await storage.set('flow', req.payload);
    return true;
});

resolver.define('loadFlow', async (req) => {

    return await storage.get('flow');

});

resolver.define('getWebhookURL', async () => {

    const URL = await webTrigger.getUrl("webhook-handler");
    return URL;

});


resolver.define('jiraApiCall', async (req) => {

    console.log("jiraApiCall", { payload: req.payload });

    const apiRequest = {
        method: req.payload.method.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if(req.payload.payload)
        apiRequest.body = JSON.stringify(req.payload.payload);

    //return await (await api.asApp().requestJira(route`/rest/api/3/issuetype`)).json();
    return await (await api.asApp().requestJira(route(req.payload.endpoint), apiRequest)).json();
    //return await api.asApp().requestJira(route(req.payload.endpoint), apiRequest);

});

export const feResolver = resolver.getDefinitions();

export const processWebhook = async (req) => {

    console.log("Incoming webhook...");

    const Blocks = require('../static/configurator-app/src/js/blocks');
    LiteGraph.registerNodes(Blocks);

    const flow = await storage.get('flow');

    const graph = new LiteGraph.LGraph(null, apiClient);
    await graph.loadJiraSpecifics();

    graph.jiraSpecifics.webtriggerURL = await webTrigger.getUrl("webhook-handler");

    graph.configure(flow);
    graph.start();

    const blockId = req.queryParameters.r[0];

    const nodes = graph.findNodesByType('Jira/Webtrigger');

    for(let n = 0; n < nodes.length; n++) {

        if(nodes[n].properties.myId === blockId) {
            nodes[n].triggerEvent(0, req.body, req.method, req.headers);
            break;
        }

    }

    await waitForCompletion(graph);

    return {
        body: 'done!',
        headers: {
            'Content-Type': ['application/json'],
        },
        statusCode: 200,
        statusText: 'OK',
    };


};
