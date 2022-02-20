import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Access, Period, SortingType } from 'src/helper/Enums';
import { Utils } from 'src/helper/Utils';
import { Repository } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { FilterAvailableScheduling } from './dto/filter.available';
import { FilterScheduling } from './dto/filter.scheduling';
import { Scheduling } from './entities/scheduling.entity';

const limit_period = 333
const zero = 0

@Injectable()
export class SchedulingService {

  constructor(
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>

  ) { }

  async create(createSchedulingDto: CreateSchedulingDto): Promise<Scheduling> {

    const { scheduling_date, scheduling_period, amount_of_income } = createSchedulingDto

    const sched = this.schedulingRepository.create(createSchedulingDto)

    sched.scheduling_date = Utils.getInstance().vefifyDate(scheduling_date)

    const isRegistered = await this.schedulingRepository.findOne({ scheduling_date: sched.scheduling_date })

    if (isRegistered) {

      return await this.checkingAvailability(isRegistered, createSchedulingDto)

    }

    if (amount_of_income > limit_period) {
      throw new BadRequestException("Quantidade de reservas informadas excede o número máximo disponível!!")
    }

    const scheduling: Scheduling = {

      id_scheduling: null,
      isActive: true,
      scheduling_date: sched.scheduling_date,
      first_period: scheduling_period == Period.FIRST_PERIOD ? amount_of_income : zero,
      second_period: scheduling_period == Period.SECOND_PERIOD ? amount_of_income : zero,
      third_period: scheduling_period == Period.THIRD_PERIOD ? amount_of_income : zero,
      fourth_period: scheduling_period == Period.FOURTH_PERIOD ? amount_of_income : zero,
      fifth_period: scheduling_period == Period.FIFTH_PERIOD ? amount_of_income : zero,
      sixth_period: scheduling_period == Period.SIXTH_PERIOD ? amount_of_income : zero,
      createAt: sched.createAt,
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

    if (scheduling_period == Period.FIRST_PERIOD) {

      scheduling.first_period = this.checkLimit(scheduling.first_period, amount_of_income)

    } else if (scheduling_period == Period.SECOND_PERIOD) {

      scheduling.second_period = this.checkLimit(scheduling.second_period, amount_of_income)

    } else if (scheduling_period == Period.THIRD_PERIOD) {

      scheduling.third_period = this.checkLimit(scheduling.third_period, amount_of_income)

    } else if (scheduling_period == Period.FOURTH_PERIOD) {

      scheduling.fourth_period = this.checkLimit(scheduling.fourth_period, amount_of_income)

    } else if (scheduling_period == Period.FIFTH_PERIOD) {

      scheduling.fifth_period = this.checkLimit(scheduling.fifth_period, amount_of_income)

    } else {

      scheduling.sixth_period = this.checkLimit(scheduling.sixth_period, amount_of_income)

    }

    return this.schedulingRepository.save(scheduling)

  }

  checkLimit(currentScheduling: number, amount_of_income: number) {

    if ((currentScheduling + amount_of_income) <= limit_period) {
      return currentScheduling + amount_of_income
    } else {
      throw new BadRequestException('Limite de reservas indisponíveis')
    }
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

  async findAvailableScheduling(filter: FilterAvailableScheduling): Promise<Scheduling> {

    const { date } = filter

    const currentDate = Utils.getInstance().vefifyDate(date)

    const saved_scheduling = await this.schedulingRepository.findOne({ scheduling_date: currentDate })

    if (saved_scheduling) {

      return this.accessScheduling(Access.AVAILABLE, saved_scheduling, currentDate)

    }

    return this.accessScheduling(Access.UNAVAILABLE, saved_scheduling, currentDate)

  }

  accessScheduling(access: Access, saved: Scheduling, currentDate: Date): Scheduling {
    return {

      id_scheduling: access == Access.AVAILABLE ? saved.id_scheduling : null,
      isActive: access == Access.AVAILABLE ? saved.isActive : false,
      scheduling_date: access == Access.AVAILABLE ? saved.scheduling_date : currentDate,
      first_period: access == Access.AVAILABLE ? limit_period - saved.first_period : limit_period,
      second_period: access == Access.AVAILABLE ? limit_period - saved.second_period : limit_period,
      third_period: access == Access.AVAILABLE ? limit_period - saved.third_period : limit_period,
      fourth_period: access == Access.AVAILABLE ? limit_period - saved.fourth_period : limit_period,
      fifth_period: access == Access.AVAILABLE ? limit_period - saved.fifth_period : limit_period,
      sixth_period: access == Access.AVAILABLE ? limit_period - saved.sixth_period : limit_period,
      createAt: access == Access.AVAILABLE ? saved.createAt : null,
      updateAt: access == Access.AVAILABLE ? saved.updateAt : null

    }
  }

}




