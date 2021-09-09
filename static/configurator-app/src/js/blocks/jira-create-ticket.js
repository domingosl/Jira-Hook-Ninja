const LiteGraph = require('../litegraph');
const AbstractBlock = require('./abstract-block');

class JiraCreateTicket extends AbstractBlock {

    static title = "Create Ticket";
    static desc = "Creates a new Jira Ticket";
    static menu = "Jira/New Ticket";


    constructor() {

        super();

        this.busy = false;

        this.typeMap = {
            Bug: 0,
            Task: 0,
            Story: 0
        };

        this.projects = [];
        this.assignees = [];

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('summary', "");
        this.addInput('description', "");

        this.addOutput('event', LiteGraph.EVENT);

        this.addProperty('type', "Bug");
        this.addProperty('project', "");
        this.addProperty('assignee', "");

        this.addWidget("space");


        this.typeComboWidget = this.addWidget(
            "combo",
            "Type",
            "Bug",
            selectedType => this.properties['type'] = selectedType,
            {values: ['Bug', 'Task', 'Story']});



        this.projectsComboWidget = this.addWidget(
            "combo",
            "Project",
            "...",
            selectedProject => this.properties['project'] = selectedProject,
            {values: []});

        this.assigneeWidget = this.addWidget(
            "combo",
            "Assignee",
            "none",
            selectedAssignee => this.properties['assignee'] = selectedAssignee,
            {values: ['none']});


        this.size = [220, 190];

    }

    async onAdded() {

        this.typeMap = this.graph.jiraSpecifics.typeMap;

        this.projects = this.graph.jiraSpecifics.projects;
        this.projectsComboWidget.options.values = this.graph.jiraSpecifics.projects.map(el=>el.name);

        this.projectsComboWidget.value = this.properties['project'] ? this.properties['project'] : this.projectsComboWidget.options.values[0];

        if(!this.properties['project'])
            this.properties['project'] = this.projectsComboWidget.options.values[0];

        this.assignees = this.graph.jiraSpecifics.assignees;

        this.assigneeWidget.options.values = ['none'].concat(this.assignees.map(el => el.displayName));

    }

    onConfigure() {

        this.typeComboWidget.value = this.properties['type'] ? this.properties['type'] : "BUG";
        this.projectsComboWidget.value = this.properties['project'] ? this.properties['project'] : "...";
        this.assigneeWidget.value = this.properties['assignee'] ? this.properties['assignee'] : "none";

    }

    async onAction(action, event) {

        if(this.busy)
            return this.error("Refused to trigger because it was working on a previous trigger");

        this.busy = true;

        const summary = this.getInputData(1);
        const description = this.getInputData(2) || "";

        if(!summary) {
            this.busy = false;
            return this.error("Summary is required!");
        }

        const bodyData = {
            update: {},
            fields: {
                summary: summary,
                issuetype: {
                    "id": this.typeMap[this.properties['type']]
                },
                project: {
                    "id": this.projects.find(p => p.name === this.projectsComboWidget.value).id
                },
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "text": description,
                                    "type": "text"
                                }
                            ]
                        }
                    ]
                }
            }
        };

        if(this.properties.assignee && this.properties.assignee !== 'none')
            bodyData.fields.assignee = { id: this.assignees.find(p => p.displayName === this.properties.assignee).accountId };

        await this.graph.apiClient.call("/rest/api/3/issue", "POST", bodyData);

        this.triggerSlot(0, event);
        this.busy = false;

        this.info("New ticket created!");

    }

}

module.exports = JiraCreateTicket;