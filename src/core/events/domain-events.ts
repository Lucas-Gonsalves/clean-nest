import type { AggregateRoot } from '@src/core/entities/aggregate-root'
import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { DomainEvent } from '@src/core/events/domain-event'

type DomainEventCallback = (event: DomainEvent) => void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static shouldRun = true

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    if (index !== -1) {
      this.markedAggregates.splice(index, 1)
    }
  }

  private static findMarkedAggregateById(id: UniqueEntityId): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateById(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(callback: DomainEventCallback, eventClassName: string) {
    const handlers = this.handlersMap[eventClassName] ?? []
    handlers.push(callback)
    this.handlersMap[eventClassName] = handlers
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name
    const handlers = this.handlersMap[eventClassName]

    if (!this.shouldRun) {
      return
    }

    if (!handlers) {
      return
    }

    for (const handler of handlers) {
      handler(event)
    }
  }
}
