import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PaymentPlansService } from './payment-plans.service';

@ApiTags('payment-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-plans')
export class PaymentPlansController {
  constructor(private readonly svc: PaymentPlansService) {}
}
