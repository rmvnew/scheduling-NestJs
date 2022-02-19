import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { ApiTags } from '@nestjs/swagger';
import { Scheduling } from './entities/scheduling.entity';
import { FilterScheduling } from './dto/filter.scheduling';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags("Scheduling")
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

  @Post()
  async create(@Body() createSchedulingDto: CreateSchedulingDto): Promise<Scheduling> {
    return this.schedulingService.create(createSchedulingDto);
  }

  @Get()
  async findAll(
    @Query() filter: FilterScheduling
  ): Promise<Pagination<Scheduling>> {
    const { limit } = filter

    filter.limit = limit > 10 ? 10 : limit;

    return this.schedulingService.findAll(filter);
  }


}
