import {getConnection} from "typeorm";
import {Query} from "../entities/Query";

const QueryController = {
    create: async (req: any, res: any) => {
        const {title, description, whoSentTheRequest} = req.body
        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Query)
                .values(
                    {
                        title: title,
                        description: description,
                        user: whoSentTheRequest
                    }
                )
                .returning('id')
                .execute();
            return res.status(200).send({data: 'Successful added your query.'})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    index: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Query, 'query')
                .where({user: req.body.whoSentTheRequest})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetch: async (_req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Query, 'query')
                .where({status: false})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    getIndividual: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Query, 'query')
                .where({id: req.params.id, status: false})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    update: async (req: any, res: any) => {

        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Query)
                .set({reply: req.body.reply, status: true})
                .where({id: req.params.id})
                .returning("*")
                .execute();
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    }
}
export default QueryController
