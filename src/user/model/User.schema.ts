import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "src/user/enum/UserRole.enum";

@Schema()
export class User{

    
    @Prop({ unique: true, required: true })
    id : number;

    @Prop({ required: true })
    name : string;

    @Prop({ required: true })
    email : string;

    @Prop({ required: true })
    password : string;

    @Prop({ required: true })
    role : UserRole;

}

export const UserSchema = SchemaFactory.createForClass(User);