import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { UserRole } from "src/user/enum/UserRole.enum";

@InputType()
export class CreateUserDto{

        @Field((type)=> Int)
        id : number;
    
        @Field()
        name : string;
    
        @Field()
        email : string;
    
        @Field()
        password : string;
    
        @Field((type)=> UserRole)
        role : UserRole;

}