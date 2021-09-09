class AbstractBlock {

    constructor() {


    }

    info(message) {
        this.graph.logger("info", "<h1>Success: " + this.type + " block</h1><br />" + message, 5000);
    }

    error(message) {
        this.graph.logger("error", "<h1>Error in " + this.type + " block</h1><br />" + message, 5000);
    }


/*    onConnectionsChange(io, slot, connected, linkInfo, inputInfo) {

        if(io === 1 && connected && linkInfo) {
            const originNode = this.graph.getNodeById(linkInfo.origin_id);
            if(typeof originNode.getOutputSchema === "function" && typeof this.setInputSchema === 'function')
                this.setInputSchema(originNode.getOutputSchema());
        }
        else if(io === 1 && !connected && typeof this.setInputSchema === 'function') {
            this.setInputSchema(null);
        }


    }

    getOutputSchema() {
        return this.schema;
    }*/

}

module.exports = AbstractBlock;