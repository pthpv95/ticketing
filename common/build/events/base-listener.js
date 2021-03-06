"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on("message", function (msg) {
            console.log("Message received " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseData(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseData = function (msg) {
        var data = msg.getData();
        if (typeof data === "string") {
            return JSON.parse(data);
        }
        return JSON.parse(data.toString("utf8"));
    };
    return Listener;
}());
exports.Listener = Listener;
