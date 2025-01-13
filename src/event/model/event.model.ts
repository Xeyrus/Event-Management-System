import { Field, Int, ObjectType } from "@nestjs/graphql";
import { EventStatus } from "../enum/EventStatus.enum";

@ObjectType()
export class Event{

    @Field((type)=>Int)
    id : number;
    
    @Field()
    title : string;

    @Field()
    description : string;

    @Field(()=>Int)
    organizerId : number;

    @Field((type)=>[Int], { nullable: 'items' })
    participants ?: (null | number)[];

    @Field((type)=>EventStatus, { nullable: true })
    status ?: EventStatus

}