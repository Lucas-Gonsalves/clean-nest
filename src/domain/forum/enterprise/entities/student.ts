import { Entity } from '@src/core/entities/entity'
import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'

interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)

    return student
  }
}
