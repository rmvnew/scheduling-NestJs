import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SortingType } from 'src/helper/Enums';
import { Utils } from 'src/helper/Utils';
import { Repository } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { FilterScheduling } from './dto/filter.scheduling';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Scheduling } from './entities/scheduling.entity';

@Injectable()
export class SchedulingService {


  constructor(
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>

  ) { }

  async create(createSchedulingDto: CreateSchedulingDto): Promise<Scheduling> {

    const { scheduling_date,scheduling_period,amount_of_income } = createSchedulingDto

    
    const sched = this.schedulingRepository.create(createSchedulingDto)

    sched.scheduling_date = Utils.getInstance().vefifyDate(scheduling_date)

    const isRegistered = await this.schedulingRepository.findOne({ scheduling_date: sched.scheduling_date })

    if (isRegistered) {

      return await this.checkingAvailability(isRegistered, createSchedulingDto)

    }

    const scheduling : Scheduling = {
      
      id_scheduling: null,
      isActive: true,
      scheduling_date: sched.scheduling_date,
      first_period: scheduling_period == '1' ? amount_of_income : 0,
      second_period: scheduling_period == '2' ? amount_of_income : 0,
      third_period: scheduling_period == '3' ? amount_of_income : 0,
      fourth_period: scheduling_period == '4' ? amount_of_income : 0,
      createAt : sched.createAt,
      updateAt: sched.updateAt
      
      
    }

   

    sched.isActive = true

    return this.schedulingRepository.save(scheduling)
  }

  async checkingAvailability(
    scheduling: Scheduling,
    createSchedulingDto: CreateSchedulingDto
  ): Promise<Scheduling> {

    const { amount_of_income, scheduling_period } = createSchedulingDto

    if (scheduling_period == '1') {
      if ((scheduling.first_period + amount_of_income) <= 500) {
        scheduling.first_period = scheduling.first_period + amount_of_income
      } else {
        throw new BadRequestException('Limite de reservas indisponíveis')
      }
    } else if (scheduling_period == '2') {
      if ((scheduling.second_period + amount_of_income) <= 500) {
        scheduling.second_period = scheduling.second_period + amount_of_income
      } else {
        throw new BadRequestException('Limite de reservas indisponíveis')
      }
    } else if (scheduling_period == '3') {
      if ((scheduling.third_period + amount_of_income) <= 500) {
        scheduling.third_period = scheduling.third_period + amount_of_income
      } else {
        throw new BadRequestException('Limite de reservas indisponíveis')
      }
    } else {
      if ((scheduling.fourth_period + amount_of_income) <= 500) {
        scheduling.fourth_period = scheduling.fourth_period + amount_of_income
      } else {
        throw new BadRequestException('Limite de reservas indisponíveis')
      }
    }



    return this.schedulingRepository.save(scheduling)

  }


  async findAll(filter: FilterScheduling): Promise<Pagination<Scheduling>> {
    const { orderBy, sort } = filter
    const queryBuilder = this.schedulingRepository.createQueryBuilder('inf')
      .andWhere('inf.isActive = true')


    if (orderBy == SortingType.ID) {

      queryBuilder.orderBy('inf.id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.isActive = true')

    } else {

      queryBuilder.orderBy('inf.createAt', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)
        .where('inf.isActive = true')

    }

    return paginate<Scheduling>(queryBuilder, filter)
  }

 
}




