import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './services/common.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    CommonService,
  ],
  exports: [CommonService],
})
export class CommonModule {}
