import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { UserRole } from "src/user/enum/UserRole.enum";

@ObjectType()
export class User{

        @Field((type)=> Int)
        id : number;
    
        @Field()
        name : string;
    
        @Field()
        email : string;

        @HideField()
        password: string;
    
        @Field((type)=> UserRole)
        role : UserRole;

}