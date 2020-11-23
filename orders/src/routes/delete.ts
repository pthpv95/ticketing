import { authorized, NotFoundError, UnauthorizedError } from "@hptickets/common"
import express, { Request, Response } from "express"
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher"
import { Order, OrderStatus } from "../models/order"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()
router.delete(
  "/api/orders/:orderId",
  authorized,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket")
    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // publish an event saying this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
