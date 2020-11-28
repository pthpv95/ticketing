import { Subjects, PaymentCreatedEvent, Publisher } from "@hptickets/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
