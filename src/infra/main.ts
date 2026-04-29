import 'dotenv/config'

import { NestFactory } from '@nestjs/core'
import { AppModule } from '@src/infra/app.module'
import { EnvService } from '@src/infra/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const env = app.get(EnvService)
  const port = env.port

  await app.listen(port)
}
bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
