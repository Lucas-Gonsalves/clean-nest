import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL as string

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString })
    super({ adapter, log: ['warn', 'error'] })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
