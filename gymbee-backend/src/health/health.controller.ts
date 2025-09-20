import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar status de saúde da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Status de saúde da aplicação',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 3600 },
        database: { type: 'boolean', example: true },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }
}
