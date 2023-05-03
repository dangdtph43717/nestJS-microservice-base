import { Controller, Get } from '@nestjs/common';
import { Public } from '@packages/authorization';
@Controller('/')
export class AppController {
  @Get()
  @Public()
  getIndex() {
    return { name: 'Base Service', status: 'ok' };
  }
}
