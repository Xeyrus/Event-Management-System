import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./model/User.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Resolver(of => User)
export class UserResolver{

    constructor(private userService : UserService){}

    @Query(returns => [User], {name : 'findAllUser'})
    findAllUser(){
        return this.userService.findAllUser();
    }

    @Mutation(returns => User, {name : 'registerUser'})
    registerUser(@Args("user") createUserDto : CreateUserDto) : Promise<User>{
        return this.userService.registerUser(createUserDto);
    }
    
}