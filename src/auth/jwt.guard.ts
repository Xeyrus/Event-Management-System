import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from "jsonwebtoken";

@Injectable()
export default class JwtGuard implements CanActivate{
    
    canActivate(context: ExecutionContext): boolean{

        const ctx = GqlExecutionContext.create(context).getContext();

        const authHeader = ctx.req.headers.authorization;

        if(authHeader){
            const token = authHeader.split(" ")[1];
            try{
                const user = jwt.verify(token, process.env.SECRET_KEY);
                ctx.user = user;
                return true;
            }catch(error){
                throw new HttpException("Invalid Token : "+ error.message, HttpStatus.UNAUTHORIZED)
            }
        } else{
            return false;
        }
    }
}