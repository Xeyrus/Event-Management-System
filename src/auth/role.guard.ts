import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export class RoleGuard implements CanActivate{

    constructor(public role: string){}

    canActivate(context: ExecutionContext): boolean {
        
        const ctx = GqlExecutionContext.create(context).getContext();

        const {role} = ctx.user;

        console.log(role+"  "+this.role);

        if(role == this.role)
            return true;

        return false;
        
    }


}