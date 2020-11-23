import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import { TicketCreatedEvent } from "@hptickets/common"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ccc",
    price: 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)
  expect(ticket!.id).toEqual(data.id)
})

it("should ack the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
