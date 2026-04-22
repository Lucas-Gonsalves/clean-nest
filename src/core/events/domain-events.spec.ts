import { describe, expect, it, vi } from 'vitest'

import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import { DomainEvents } from '@/core/events/domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber (listening event of created answer)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Creating an answer without saving it to the database
    const aggregate = CustomAggregate.create()

    // Ensuring that the event was created, though it was not dispatched
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving the answer it to the database, and so dispatching the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscribe listen to the event, and proccess data
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
