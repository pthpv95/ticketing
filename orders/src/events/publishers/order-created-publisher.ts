import { OrderCreatedEvent, Publisher, Subjects } from "@hptickets/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
