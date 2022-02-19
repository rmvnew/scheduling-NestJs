import { ApiProperty } from "@nestjs/swagger"

export class CreateSchedulingDto {

    @ApiProperty()
    scheduling_date: String

    @ApiProperty()
    scheduling_period: string

    @ApiProperty()
    amount_of_income: number

    // @ApiProperty({required:false,default:0})
    // first_period: number

    // @ApiProperty({required:false,default:0})
    // second_period: number

    // @ApiProperty({required:false,default:0})
    // third_period: number

    // @ApiProperty({required:false,default:0})
    // fourth_period: number
 
    isActive: boolean

    createAt: string

    updateAt: string


}
