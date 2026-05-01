import { UniqueEntityId } from '@src/core/entities/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
