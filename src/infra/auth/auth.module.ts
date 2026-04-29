import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@src/infra/auth/jwt.strategy'

import { EnvModule } from '@/src/infra/env/env.module'
import { EnvService } from '@/src/infra/env/env.service'

import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    EnvModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: env.jwtPrivateKey.replace(/\\n/g, '\n'),
          publicKey: env.jwtPublicKey.replace(/\\n/g, '\n'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
