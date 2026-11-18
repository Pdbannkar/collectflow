import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MandatesService {
  private readonly logger = new Logger(MandatesService.name);
  constructor(private prisma: PrismaService) {}
}
