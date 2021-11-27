import {User} from "../entities/User";
import {getConnection} from "typeorm";
import {v4 as uuid} from 'uuid'

const UserController = {
    create: async (req: any, res: any) => {
        let {name, email, address, password, phone, pincode} = req.body
        try {
            let insertUser = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(
                    {
                        name: name,
                        email: email,
                        address: address,
                        password: password,
                        phone: phone,
                        pincode: pincode,
                    }
                )
                .returning('id')
                .execute();

            req.session.userId = insertUser.raw[0].id
            req.session.token = uuid()
            return res.status(200).send({data: 'Successful Sign Up.'})
        } catch (err) {
            return res.status(400).send({errors: 'Email already exists. Try Login.'})
        }
    },
    index: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select("user")
                .from(User, "user")
                .where({id: req.body.whoSentTheRequest})
                .getOne();
            return res.send({data: result})
        }
        catch (err){
            return res.status(401).send({errors: 'No user found'})
        }
    },
    update: async (req: any, res: any) => {
        let {name, password, address, pincode, phone} = req.body
        try {
            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({name: name, address: address, pincode: pincode, phone: phone, password: password})
                .where({id: req.body.whoSentTheRequest})
                .execute();
            return res.status(200).send({data:'Successfully updated your profile.'})
        } catch (err){
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
}

export default UserController
