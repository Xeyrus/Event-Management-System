import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../user/model/User.schema";
import { EventStatus } from "src/event/enum/EventStatus.enum";

@Schema()
export class Event{

    @Prop({required : true, unique : true})
    id : number;

    @Prop({required : true, maxlength : 50})
    title : string;

    @Prop({required : true, maxlength : 200})
    description : string;

    @Prop({required : true})
    organizerId : number;

    @Prop({ type: [Number], default: [] })
    participants ?: number[];

    @Prop()
    status ?: EventStatus
    
}

export const EventSchema = SchemaFactory.createForClass(Event);