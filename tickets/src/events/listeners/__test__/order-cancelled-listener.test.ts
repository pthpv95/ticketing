import { OrderCancelledEvent } from "@hptickets/common"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Message } from "node-nats-streaming"

import mongoose from "mongoose"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const ticket = Ticket.build({
    title: "chelsea",
    price: 10,
    userId: "1212",
  })
  ticket.orderId = new mongoose.Types.ObjectId().toHexString()
  await ticket.save()

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it("set orderId of ticket to be undefined", async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
})

it("ack the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})