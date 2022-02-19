import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { OperationType } from "./Enums";


export class Utils {


    private static instance: Utils
    private constructor() { }
    public static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils()
        }
        return Utils.instance
    }



    getCurrentDate(): string {

        let currentDate = new Date();
        let date = this.getFillNumber(currentDate.getDate())
        let month = this.getFillNumber((currentDate.getMonth() + 1))
        let year = currentDate.getFullYear();
        let hours = this.getFillNumber(currentDate.getHours());
        let minutes = this.getFillNumber(currentDate.getMinutes())
        let seconds = this.getFillNumber(currentDate.getSeconds())

        return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`

    }

    getFillNumber(number: Number) {
        return `0${number}`.slice(-2)
    }

    getValidName(name: string) {

        let currentName = name.toUpperCase()

        currentName = currentName.replace(/\s+/g, " ")

        if (this.validateUser(/[!@#$%^&*(),.?":{}|<>]/g, currentName)) {
            throw new BadRequestException('O nome não pode conter caracteres especiais!!')
        }

        return currentName
    }

    private validateUser(regex: RegExp, value: string): boolean {
        return regex.test(value)
    }

    async encryptPassword(pass: string): Promise<string> {
        const saltOrRounds = 10;
        const newPass = await bcrypt.hash(pass, saltOrRounds)
        return newPass
    }

    getDate(date: string): Date {

        let newData = date.replace(/(\d+[/])(\d+[/])/, '$2$1');
        return new Date(newData);

    }


    getFormatedUsDate(date: string) {

        const currentDate = date.split('/')
        const day = currentDate[0]
        const month = currentDate[1]
        const year = currentDate[2]
        return new Date(`${year}/${month}/${day}`)

    }

    getOperation(type: OperationType) {

        if (type == OperationType.CONSUMO) {
            return 'Consumo'
        } else if (type == OperationType.EMPRESTIMO) {
            return 'Emprestimo'
        } else {
            throw new BadRequestException('Operação informada inválida!!')
        }
    }

    vefifyDate(requestedDate:String):Date{

        const reqDate = requestedDate.split('/')
        const day = reqDate[0]
        const month = reqDate[1]
        const year = reqDate[2]

        const currentDate = new Date()
        const analisedDate = new Date(`${year}-${month}-${day} 00:00:00`)

        if(currentDate > analisedDate){
            throw new BadRequestException(`Data informata é inválida ${requestedDate}`)
        }
        
        return analisedDate
        
    }


}