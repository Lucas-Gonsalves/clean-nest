import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3000),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY_ID: z.string(),
  AWS_ENDPOINT: z.string(),
  AWS_REGION: z.string(),
})

export type Env = z.infer<typeof envSchema>

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  private get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }

  get databaseUrl() {
    return this.get('DATABASE_URL')
  }

  get port() {
    return this.get('PORT')
  }

  get jwtPrivateKey() {
    return this.get('JWT_PRIVATE_KEY')
  }

  get jwtPublicKey() {
    return this.get('JWT_PUBLIC_KEY')
  }

  get awsBucketName() {
    return this.get('AWS_BUCKET_NAME')
  }

  get awsAccessKeyId() {
    return this.get('AWS_ACCESS_KEY_ID')
  }

  get awsSecretAccessKeyId() {
    return this.get('AWS_SECRET_ACCESS_KEY_ID')
  }

  get awsEndPoint() {
    return this.get('AWS_ENDPOINT')
  }

  get awsRegion() {
    return this.get('AWS_REGION')
  }
}
