import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { authModule } from './auth/auth.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    authModule,
  ],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
