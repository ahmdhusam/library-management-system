import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseService, Roles } from '../database/database.service';
import { UseRoles } from '../auth/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@ApiBearerAuth()
@UseRoles(Roles.ADMIN)
@Controller('health')
export class HealthController {
  // 150M
  private readonly SizeInMB = 150 * 1024 ** 2;

  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly DBContext: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', this.SizeInMB),
      () => this.memory.checkRSS('memory_rss', this.SizeInMB),
      () => this.db.pingCheck('database', this.DBContext),
    ]);
  }
}
