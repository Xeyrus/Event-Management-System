import { registerEnumType } from "@nestjs/graphql";

export enum EventStatus{

    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED"
    
}

registerEnumType(EventStatus, {
    name: 'EventStatus',
});