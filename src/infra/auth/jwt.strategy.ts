import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import z from 'zod'

import { EnvService } from '@/src/infra/env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwtPublicKey.replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
