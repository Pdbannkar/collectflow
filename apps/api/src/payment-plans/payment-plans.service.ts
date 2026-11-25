import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PaymentPlansService {
  private readonly logger = new Logger(PaymentPlansService.name);
  constructor(private prisma: PrismaService) {}
}
