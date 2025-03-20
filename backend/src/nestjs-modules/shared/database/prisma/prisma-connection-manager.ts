import { PrismaClient } from '@prisma/client';

export class PrismaConnectionManager {
  private static prisma: PrismaClient | null = null;
  private static timeout: NodeJS.Timeout | null = null;

  static async getPrismaClient() {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
    }

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(async () => {
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
      }
      this.timeout = null;
    }, 60000);

    return this.prisma;
  }
}
