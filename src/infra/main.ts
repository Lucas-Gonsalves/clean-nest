import 'dotenv/config'

import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@src/infra/app.module'
import { Env } from '@src/infra/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
