import { Publisher, Subjects, TicketCreatedEvent } from "@hptickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}