"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // when the order has been created but the ticket it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // the ticket the order is trying to reserve has already been reserved
    // or when the user has cancelled the order
    // the order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    OrderStatus["Completed"] = "completed";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
