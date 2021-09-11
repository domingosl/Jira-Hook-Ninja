const AbstractBlock = require('./abstract-block');
const LiteGraph = require("../litegraph");


const hmacSHA1 = require('crypto-js/hmac-sha1');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');

const sha1 = require('crypto-js/sha1');
const sha256 = require('crypto-js/sha256');
const sha512 = require('crypto-js/sha512');

const Base64 = require('crypto-js/enc-base64');
const Hex = require('crypto-js/enc-hex');

class CryptoHmac extends AbstractBlock {

    static title = "HMAC";
    static desc = "Executes a Hmac operation";
    static menu = "Crypto/HMAC";

    constructor(props) {

        super(props);

        this.addInput('trigger', LiteGraph.ACTION);
        this.addInput('Message', 'string');
        this.addInput('Secret', 'string');

        this.addOutput('event', LiteGraph.EVENT);
        this.addOutput('Hmac digest ', 'string');


        this.addWidget("space");

        this.shaAlgoComboWidget = this.addWidget(
            "combo",
            "SHA algo",
            "sha1",
            value => this.properties['shaAlgo'] = value,
            { values: ['sha1', 'sha256', 'sha512'] } );

        this.digestComboWidget = this.addWidget(
            "combo",
            "Digest",
            "hex",
            value => this.properties['digest'] = value,
            { values: ['hex', 'base64'] } );


        this.resizable = true;


    }

    onConfigure() {

        this.shaAlgoComboWidget.value = this.properties.shaAlgo || 'sha1';
        this.digestComboWidget.value = this.properties.digest || 'hex';

    }

    onAction(action, event) {

        let hmacAlgo;

        if(this.properties.shaAlgo === 'sha1' || !this.properties.shaAlgo) {
            hmacAlgo = hmacSHA1;
        }
        else if(this.properties.shaAlgo === 'sha256') {
            hmacAlgo = hmacSHA256;
        }
        else if(this.properties.shaAlgo === 'sha512') {
            hmacAlgo = hmacSHA512;
        }


        this.setOutputData(1,
            (this.properties.digest === 'base64' ? Base64 : Hex)
                .stringify(hmacAlgo((this.getInputData(1) + ""), this.getInputData(2) + "")));

        this.triggerSlot(0, event);
    }

}

module.exports = CryptoHmac;