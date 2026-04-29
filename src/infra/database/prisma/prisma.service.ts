import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@src/generated/prisma/client'

import { EnvService } from '@/src/infra/env/env.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(env: EnvService) {
    const url = new URL(env.databaseUrl)
    const schema = url.searchParams.get('schema') ?? 'public'

    url.searchParams.delete('schema')

    const adapter = new PrismaPg({ connectionString: url.toString() }, { schema })
    super({ adapter, log: ['warn', 'error'] })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
