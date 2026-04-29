import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Student, type StudentProps } from '@src/domain/forum/enterprise/entities/student'

export function makeStudent(overrride: Partial<StudentProps> = {}, id?: UniqueEntityId) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrride,
    },
    id,
  )

  return student
}
