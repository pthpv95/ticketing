import { OrderCancelledEvent, Publisher, Subjects } from "@hptickets/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
