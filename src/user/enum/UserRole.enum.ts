import { registerEnumType } from "@nestjs/graphql";

export enum UserRole{

    ADMIN = "ADMIN",
    ORGANIZER = "ORGANIZER",
    PARTICIPANT = "PARTICIPANT"
    
}

registerEnumType(UserRole, {
    name: 'UserRole',
});