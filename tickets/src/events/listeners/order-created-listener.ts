import { Listener, OrderCreatedEvent, Subjects } from "@hptickets/common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/tickets"
import { natsWrapper } from "../../nats-wrapper"
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"
import { queueGroupName } from "./queue-group-name"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error("Ticket not found")
    }

    ticket.set({ orderId: data.id })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      orderId: ticket.orderId,
      version: ticket.version,
      userId: ticket.userId,
      price: ticket.price,
    })
    msg.ack()
  }
}
