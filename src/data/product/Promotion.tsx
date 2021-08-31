export enum PromoEnum {
    CASH,
    PERCENTAGE
}

export class Promo {
    type: PromoEnum
    value: number

    constructor(type: PromoEnum, value: number){
        this.type = type;
        this.value = value;
    }
}