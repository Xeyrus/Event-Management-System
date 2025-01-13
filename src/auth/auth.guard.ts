import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/user/model/User.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private readonly userService : UserService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{

        const ctx = GqlExecutionContext.create(context).getContext();
        const{id, password} = ctx.req.body.variables;
        const user : User = await this.userService.findUser(id);

        if(user && user.password == password){
            ctx.user = user;
            return true;
        } else{
            throw new HttpException("Unauthenticated", HttpStatus.UNAUTHORIZED)
        }

    }
}