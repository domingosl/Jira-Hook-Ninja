const LiteGraph = require('../litegraph');
const AbstractBlock = require('./abstract-block');

class Click extends AbstractBlock {

    static title = "Click Event";
    static desc = "Propagates a <strong>click event</strong> when clicked.";

    static menu = 'Debug/Click'

    constructor(props) {
        super(props);

        this.addProperty("text", "Click");
        this.addProperty("fontSize", 20);

        this.font = "Lato";
        this.margin = 20;

        this.verticalOffset = 10;

        this.addOutput('trigger', LiteGraph.EVENT);

        this.size = [170, 90];
        this.clicked = false;

        this.resizable = false;
    }

    getOutputSchema() {
        return {}
    }

    onDrawForeground(ctx) {

        if (this.flags.collapsed) {
            return;
        }


        ctx.fillStyle = "#0052CC";

        ctx.fillRect(
            this.margin,
            this.margin + this.verticalOffset,
            this.size[0] - this.margin * 2,
            this.size[1] - this.verticalOffset - this.margin * 2
        );

        ctx.fillStyle = this.clicked
            ? "#3c75c9"
            : this.mouseOver
                ? "#125dcd"
                : "#0052CC";

        ctx.fillRect(
            this.margin,
            this.margin + this.verticalOffset,
            this.size[0] - this.margin * 2,
            this.size[1] - this.verticalOffset - this.margin * 2
        );

        if (this.properties.text || this.properties.text === 0) {

            const font_size = this.properties.fontSize || 10;

            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.font = "400 " + font_size + "px Lato";
            ctx.fillText(
                this.properties.text,
                this.size[0] * 0.5,
                this.size[1] * 0.5 + font_size * 0.55
            );
            ctx.textAlign = "left";
        }
    };

    onMouseDown(e, local_pos) {
        if (
            local_pos[0] > this.margin &&
            local_pos[1] > this.margin + this.verticalOffset &&
            local_pos[0] < this.size[0] - this.margin &&
            local_pos[1] < this.size[1] - this.margin
        ) {
            this.clicked = true;
            this.triggerSlot(0, { eventType: "click", timestamp: new Date().getTime(), data: null });
            return true;
        }
    };

    onMouseUp(e) {
        this.clicked = false;
    };

}

module.exports = Click;