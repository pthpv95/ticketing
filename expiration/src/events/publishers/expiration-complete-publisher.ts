import { Subjects, Publisher, ExpirationCompleteEvent } from "@hptickets/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
