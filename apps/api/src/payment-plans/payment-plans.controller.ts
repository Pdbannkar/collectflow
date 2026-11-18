import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Payment $args[0].Groups[1].Value.ToUpper() lansService } from './payment-plans.service';

@ApiTags('payment-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-plans')
export class Payment $args[0].Groups[1].Value.ToUpper() lansController {
  constructor(private readonly svc: Payment $args[0].Groups[1].Value.ToUpper() lansService) {}
}
