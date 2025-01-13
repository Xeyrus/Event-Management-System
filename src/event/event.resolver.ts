import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventService } from "./event.service";
import { Event } from "./model/event.model";
import { EventStatus } from "./enum/EventStatus.enum";
import { User } from "src/user/model/User.model";
import { UseGuards } from "@nestjs/common";
import JwtGuard from "src/auth/jwt.guard";
import { RoleGuard } from "src/auth/role.guard";
import { UserRole } from "src/user/enum/UserRole.enum";
import { PubSub } from "graphql-subscriptions";

@Resolver(of=>Event)
@UseGuards(JwtGuard)
export class EventResolver{

    constructor(
        private eventService : EventService,
        private pubsub : PubSub
    ){}

    @Query(returns => [Event], {name : 'findAllEvent'})
    findAllEvent(){
        return this.eventService.findAllEvent();
    }

    @Query(()=>[Event])
    findEventByStatus(@Args('status', {type : () => EventStatus}) status : EventStatus){
        return this.eventService.findEventByStatus(status);
    }

    @Query(()=>[Event])
    findEventsByUserId(@Args('userId') userId : number){
        return this.eventService.findEventByUserId(userId);
    }

    @Query(()=>[User])
    findParticipantForEvent(@Args('eventId') eventId : number){
        return this.eventService.findParticipantForEvent(eventId);
    }

    @Mutation(returns => Event, {name : 'createEvent'})
    @UseGuards(new RoleGuard(UserRole.ORGANIZER))
    createEvent(
        @Args('event') createEventDto : CreateEventDto,
        @Context("user") user : User
    ) : Promise<Event>{
        createEventDto.organizerId = user.id;
        return this.eventService.createEvent(createEventDto);
    }

    @Mutation(returns => String,{name : 'cancelEvent'})
    @UseGuards(new RoleGuard(UserRole.ORGANIZER))
    cancelEvent(
        @Args('userId', { type: () => Int }) userId : number, 
        @Args('eventId', { type: () => Int }) eventId : number){
            const message = this.eventService.cancelEvent(userId, eventId);
            this.pubsub.publish('cancelEventSubscription',{ message : message});
            return message;
    }

    @Subscription(()=>String ,{
        filter : (payload,variables) => payload.message === "event cancelled"
    })
    cancelEventSubscription(){
        this.pubsub.asyncIterableIterator('cancelEventSubscription')
    }



    @Mutation(returns => String, {name : 'registerUserForEvent'})
    @UseGuards(new RoleGuard(UserRole.PARTICIPANT))
    registerUserForEvent(
        @Args('userId', { type : () => Int}) userId : number,
        @Args('eventId', { type : () => Int}) eventId : number){
            return this.eventService.registerParticipant(userId, eventId);
    }
}