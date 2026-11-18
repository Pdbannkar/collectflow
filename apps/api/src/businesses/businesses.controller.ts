import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { BusinessesService } from './businesses.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private svc: BusinessesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new business' })
  register(@Body() body: any, @CurrentUser() user: any) {
    return this.svc.register(body, user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get authenticated user business' })
  getMy(@CurrentUser() user: any) {
    return this.svc.getByOwnerId(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.getById(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business profile' })
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.svc.update(id, body, user);
  }

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics for a business' })
  dashboard(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.getDashboardMetrics(id, user);
  }
}
