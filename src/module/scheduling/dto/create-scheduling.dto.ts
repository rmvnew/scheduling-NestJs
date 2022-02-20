import { ApiProperty } from "@nestjs/swagger"

export class CreateSchedulingDto {

    @ApiProperty()
    scheduling_date: string

    @ApiProperty()
    scheduling_period: string

    @ApiProperty()
    amount_of_income: number

    isActive: boolean

    createAt: string

    updateAt: string


}
