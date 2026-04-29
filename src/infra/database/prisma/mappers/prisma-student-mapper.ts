import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { Student } from '@/src/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaUser } from '@/src/generated/prisma/client'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      password: student.password,
    }
  }
}
