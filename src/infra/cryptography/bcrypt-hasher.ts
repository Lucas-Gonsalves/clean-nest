import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/src/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/src/domain/forum/application/cryptography/hash-generator'

export class bcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGHT = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGHT)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
