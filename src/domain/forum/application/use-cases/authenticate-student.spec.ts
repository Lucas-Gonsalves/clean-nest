import { beforeEach, describe, expect, it } from 'vitest'

import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeStudent } from '@/test/factories/forum/make-student'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'

import { AuthenticateStudentUseCase } from './authenticate-student'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate the student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong credentials',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
