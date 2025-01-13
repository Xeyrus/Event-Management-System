import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './model/Event.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/model/User.schema';
import { EventStatus } from './enum/EventStatus.enum';
import { UserRole } from 'src/user/enum/UserRole.enum';

@Injectable()
export class EventService {

    constructor(
        @InjectModel(Event.name) private readonly eventModel : Model<Event>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}

    async findAllEvent(){
        return await this.eventModel.find();
    }

    async findEventByStatus(status : EventStatus){
        return await this.eventModel.find({status : status});
    }

    async findEventByUserId(userId : number){
        return await this.eventModel.find({ participants: { $in: [userId] } });
    }

    async findParticipantForEvent(eventId : number){

        const event = await this.eventModel.findOne({id : eventId});

        if(!event)
            throw new HttpException("No event Found", HttpStatus.NOT_FOUND)

        const participants = event.participants;

        return this.userModel.find({ id: { $in: participants } });
    }

    async createEvent({organizerId, ...event} : Event){
        if(!event)
            throw new HttpException("Event can't be created", HttpStatus.NOT_ACCEPTABLE)

        const organizer = await this.userModel.findOne({ id: organizerId });

        if(!organizer)
            throw new HttpException("Organizer Id invalid", HttpStatus.NOT_FOUND);
        
        if(organizer.role === UserRole.ORGANIZER || organizer.role === UserRole.ADMIN){
            const eventDb = new this.eventModel({...event, status : EventStatus.ACTIVE, organizerId : organizerId});
            return await eventDb.save();
        } else{
            throw new HttpException("User not authorized to create an event", HttpStatus.UNAUTHORIZED)
        }
        
    }

    async cancelEvent(userID : number, eventId : number){
        
        const organizer = await this.userModel.findOne({id : userID});

        if(!organizer || organizer.role == UserRole.PARTICIPANT)
            throw new HttpException("Illegal Organizer Id", HttpStatus.NOT_ACCEPTABLE);

        const event = await this.eventModel.findOne({id : eventId});

        if(!event){
            throw new HttpException("Illegal Event Id", HttpStatus.NOT_ACCEPTABLE);
        } else{
            if(organizer.role === UserRole.ORGANIZER &&  event.organizerId != userID)
                throw new HttpException("Not authorized to cancel this event", HttpStatus.UNAUTHORIZED);

            if(event.status === EventStatus.CANCELLED)
                return "Event already cancelled";

            else{
                event.status = EventStatus.CANCELLED;
                await this.eventModel.updateOne({id : eventId}, { $set: { status: EventStatus.CANCELLED } })
                return "event cancelled";
            }
        }        
    }

    async registerParticipant(userId : number, eventId : number){

        const user = await this.userModel.findOne({id : userId})

        if(!user)
            throw new HttpException("Invalid userId", HttpStatus.NOT_ACCEPTABLE);
        else if(user.role != UserRole.PARTICIPANT)
            throw new HttpException("Invalid role", HttpStatus.NOT_ACCEPTABLE); 

        const event = await this.eventModel.findOne({id : eventId});

        if(!event || event.status === EventStatus.CANCELLED)
            throw new HttpException("Invalid event", HttpStatus.NOT_ACCEPTABLE);
        else{
            if(event.participants.includes(userId))
                return "User already registered";

            await this.eventModel.updateOne({id : eventId}, { $push: { participants: userId} } )
            return "User registered";
        }
    }

}
