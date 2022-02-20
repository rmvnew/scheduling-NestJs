import { ApiProperty } from "@nestjs/swagger";






export class FilterAvailableScheduling{

    @ApiProperty({required:true})
    date : string

}