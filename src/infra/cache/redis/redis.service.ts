import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

import { EnvService } from '../../env/env.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.redisHost,
      port: envService.redisPort,
      db: envService.redisDb,
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
