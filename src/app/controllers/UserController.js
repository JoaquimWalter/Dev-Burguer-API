import { v4 } from "uuid";
import User from "../models/User.js";



class UserController{
    async store(request, response){
        // console.log("REQUEST", request.body)
        const {name, email, password_hash, admin } = request.body;

        const existingUser  = await User.findOne({
            where: {
                email
            }
        })

        if(existingUser){
            return response
            .status(400)
            .json({message:"Este email ja esta cadastrado!"})
        }
        
    const user = await User.create({
        id: v4(),
        name,
        email,
        password_hash,
        admin,
    });

    return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,

    }); 

    }
}

export default new UserController();