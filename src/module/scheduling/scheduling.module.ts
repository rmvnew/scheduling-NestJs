import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from './entities/scheduling.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Scheduling])
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports:[SchedulingService]
})
export class SchedulingModule {}
