import { Field, InputType, Int } from "@nestjs/graphql";
import { EventStatus } from "../enum/EventStatus.enum";

@InputType()
export class CreateEventDto{

    @Field((type)=>Int)
    id : number;

    @Field()
    title : string;

    @Field()
    description : string;

    @Field((type)=>Int)
    organizerId : number;

    @Field((type)=>[Int], { nullable: 'items' })
    participants ?: (null | number)[];

    @Field((type)=>EventStatus,{ nullable: true })
    status ?: EventStatus.ACTIVE
        
}