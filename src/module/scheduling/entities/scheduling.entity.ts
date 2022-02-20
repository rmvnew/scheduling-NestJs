import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"



@Entity('scheduling')
export class Scheduling {


    @PrimaryGeneratedColumn()
    id_scheduling: number

    @Column()
    scheduling_date: Date

    @Column()
    first_period: number

    @Column()
    second_period: number

    @Column()
    third_period: number

    @Column()
    fourth_period: number

    @Column()
    fifth_period : number

    @Column()
    sixth_period : number

    @Column()
    isActive: boolean

    @CreateDateColumn()
    createAt: string

    @UpdateDateColumn()
    updateAt: string

}
