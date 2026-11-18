import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MandatesService } from './mandates.service';

@ApiTags('mandates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mandates')
export class MandatesController {
  constructor(private readonly svc: MandatesService) {}
}
