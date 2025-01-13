import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/event/model/Event.schema';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/model/User.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports : [
    MongooseModule.forFeature([
      {
        name : Event.name,
        schema : EventSchema
      },
      {
        name : User.name,
        schema : UserSchema
      }
    ]),
    UserModule
  ],
  providers : [EventResolver, EventService,
    {
        provide: PubSub,
        useValue: new PubSub(),
    },]
})
export class EventModule {}
