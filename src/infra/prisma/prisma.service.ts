import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@src/generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = new URL(process.env.DATABASE_URL as string)
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
