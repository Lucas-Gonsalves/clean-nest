import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAttachmentsRepository } from '@/test/repositories/forum/in-memory-attachments-repository '
import { FakeUploader } from '@/test/storage/fake-uploader'

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload And Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader)
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toMatchObject({
      fileName: 'profile.png',
    })
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
    expect(fakeUploader.uploads).toHaveLength(0)
    expect(inMemoryAttachmentsRepository.items).toHaveLength(0)
  })
})
