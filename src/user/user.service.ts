import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/model/User.schema';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel : Model<User>
    ){}

    async findAllUser(){
        return await this.userModel.find();
    }

    async findUser(id : number){
        return await this.userModel.findOne({id : id})
    }

    async registerUser(user : User){
        if(!user)
            throw new HttpException("User data incorrect",HttpStatus.NOT_ACCEPTABLE)
        const userDb = new this.userModel(user);
        return await userDb.save();
    }

}
