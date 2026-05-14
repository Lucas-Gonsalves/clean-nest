import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

import { Uploader, UploadParams } from '@/src/domain/forum/application/storage/uploader'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: envService.awsEndPoint,
      region: envService.awsRegion,
      forcePathStyle: true,
      credentials: {
        accessKeyId: envService.awsAccessKeyId,
        secretAccessKey: envService.awsSecretAccessKeyId,
      },
    })
  }

  async upload({ fileName, fileType, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.awsBucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
