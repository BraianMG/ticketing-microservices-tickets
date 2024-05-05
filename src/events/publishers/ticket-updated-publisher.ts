import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@braianmg-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
