import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Student, type StudentProps } from '@src/domain/forum/enterprise/entities/student'

import { PrismaStudentMapper } from '@/src/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

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

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.user.create({ data: PrismaStudentMapper.toPersistence(student) })

    return student
  }
}
