import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-event"
import { ExpirationCompleteEvent, OrderStatus } from "@hptickets/common"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { Order } from "../../../models/order"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "cs",
    price: 1,
  })
  await ticket.save()
  const order = Order.build({
    userId: "dsdszx",
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it("updates order status to cancelled", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.orderId)
  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it("should ack the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("emit OrderCancelled event", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled()
})