import {User} from "../entities/User";
import {getConnection} from "typeorm";
import {v4 as uuid} from 'uuid'

const SessionController = {
    show: async (_req: any, res: any) => {
        res.status(200).send({data: 'Authorized'})
    },
    destroy: async (req: any, res: any) => {
        req.session.destroy(() => {
            res.status(200).send({data: 'Unauthorized'});
        });
    },
    create: async (req: any, res: any) => {

        let {email, password} = req.body

        if (!email) {
            return res.status(400).send({
                errors: 'Email required.'
            })
        }

        if (!password) {
            return res.status(400).send({
                errors: 'Password required.'
            })
        }

        try {
            let fetchUser = await getConnection()
                .createQueryBuilder()
                .select()
                .from(User, 'user')
                .where({email: email})
                .execute()

            if (!fetchUser[0]) {
                return res.status(400).send({errors: 'Invalid Email.'})
            }
            if (fetchUser[0].password != req.body.password) {
                return res.status(400).send({errors: 'Invalid password.'})
            }
            req.session.userId = fetchUser[0].id
            req.session.token = uuid()
            return res.status(200).send({data: 'Logged In'})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    }
}

export default SessionController