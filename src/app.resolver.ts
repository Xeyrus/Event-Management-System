import { Args, Context, Int, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user/model/User.model";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth/auth.guard";
import * as jwt from "jsonwebtoken";

@Resolver(of => String)
export class AppResolver{

    @Query(returns => String)
    @UseGuards(AuthGuard)
    login(
        @Args({name : "id", type : () => Int}) id : number,
        @Args({name : "password" , type : () => String}) passwordSent : string,
        @Context("user") user : User
    ):string{
        let payload = {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role
        };
        return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : "200s"});
    }
}